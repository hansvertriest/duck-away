import mongoose, { NextFunction, Request, Response } from 'express';
import { CheckPointModel, CheckPointModelKeys, DuckModel, IDuck, ICheckPoint, ISubscriber, SubscriberModel } from '../models';
import { Utils, GridFs, IConfig } from '../services';
import { Types } from 'mongoose';

class CheckPointController {
    config: IConfig;

    constructor(config: IConfig) {
        this.config = config;
    }

    public newCheckPoint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const duckId = req.body.verifiedDuckId || req.params.duckId;
            const { position, pictureName } = req.body;

            // filter props to existing keys
            const filteredProps = Utils.filterKeysAgainstModelKeys({
                duck: duckId,
                position,
                pictureName: pictureName || ""
            }, CheckPointModelKeys);

            if (!duckId || !position) {
                throw { status: 412, msg: "Given data does not meet requirements" }
            }

            // find duck
            const duck: IDuck = await DuckModel.findOne({ _id: duckId })
                .catch(() => {
                    throw { status: 404, msg: "Could not find data." };
                });

            // create model
            const newCheckPoint = new CheckPointModel(filteredProps);

            // save model
            const savedCheckPoint = await newCheckPoint.save()
                .catch((error) => {
                    const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
                    console.log(log)
                    if (error.code == 11000) throw { status: 412, msg: "Duplicate duck name" };
                    throw { status: 500, msg: "Could not save data" };
                });

            // update duck
            duck.checkPoints.push(newCheckPoint._id);
            const populatedDuck = await duck.populate('checkPoints').execPopulate();

            const positions = populatedDuck.checkPoints.map((checkPoint: any) => checkPoint.position)
            
            const latestPosition = (positions.length - 1 >= 0) ? positions[positions.length - 1] : undefined;
            if (latestPosition) {
                duck.distanceFromStart = Utils.calculateDistanceFromHome(duck.startPosition, positions[positions.length - 1]);
            } else {
                duck.distanceFromStart = 0;
            }
            
            if (positions.length > 0) { 
                const totalDistance = Utils.calculateTotalDistanceOfPositionArray(duck.startPosition, positions);
                duck.totalDistance = totalDistance;
            }
            await duck.save();

            // populate checkpoint
            const populatedCheckPoint = await savedCheckPoint.populate('duck').execPopulate();
            
            // send mail to admins
            Utils.sendMail(
                this.config.mail, 
                `${duck.name} has been in a checkpoint!`, 
                `<h1>New checkpoint for ${duck.name} has been made!</h1><p>${newCheckPoint._id}</p><img src="https://duck-away-api.herokuapp.com/picture/${pictureName}" /><br><a href="https://duck-away-api.herokuapp.com/admin/approve/checkpoint/${newCheckPoint._id}">Keur goed</a>`,
                'info@duck-away.com'
            );

            res.send(populatedCheckPoint);
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { checkPointId } = req.body;

            if (!checkPointId) {
                throw { status: 412, msg: "Given data does not meet requirements" }
            }

            // delete picture
            const checkpoint: ICheckPoint = await CheckPointModel.findOne({ _id: checkPointId })
                .catch(() => {
                    throw { status: 404, msg: "Could not find checkpoint" };
                });

            if (!checkpoint) throw { status: 404, msg: "Checkpoint not found" };
            
            const imageId = await GridFs.getFileId(checkpoint.pictureName);
            
            let deletedImage = false;
            if (imageId) {
                await GridFs.deleteImage(imageId);
                deletedImage = true;
            }

            // delete checkpoint in duck
            const duck: IDuck = await DuckModel.findOneAndUpdate({_id: Types.ObjectId(checkpoint.duck)}, {'$pull': {checkPoints: checkPointId}});

            // delete checkpoint
            await checkpoint.remove();

            // recalculate total distance of duck
            if (!duck) throw { status: 404, msg: "Duck not found" };

            const populatedDuck = await duck.populate('checkPoints').execPopulate();

            const positions = populatedDuck.checkPoints.map((checkPoint: any) => checkPoint.position);

            const latestPosition = (positions.length - 1 >= 0) ? positions[positions.length - 1] : undefined;
            if (latestPosition) {
                duck.distanceFromStart = Utils.calculateDistanceFromHome(duck.startPosition, positions[positions.length - 1]);
            } else {
                duck.distanceFromStart = 0;
            }
            
            if (positions.length > 0) { 
                const totalDistance = Utils.calculateTotalDistanceOfPositionArray(duck.startPosition, positions);
                duck.totalDistance = totalDistance;
            } else {
                duck.totalDistance = 0;
            }
            duck.save();

            res.send({deletion: 'ok', deletedImage});
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }


    public getCheckPoints = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const { page , limit } = req.query;

            const options = {
                page: page || 1,
                limit: limit || 36,
                sort: '-createdAt'
            };


            const model : any = CheckPointModel;
            
            var myAggregate = model.aggregate(
                [
                {$lookup: {
                    from:"ducks",
                    localField: "duck",
                    foreignField: "_id",
                    as: "duck"
                
                   }},
                { $addFields: {
                    "duck": {
                        "$arrayElemAt": [ "$duck", 0 ]
                    }
                }}]
            );
            const checkpoints = await model.aggregatePaginate(myAggregate, options);

            res.send({checkpoints});
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    public approve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;

            // get doc
            const checkpoint: ICheckPoint = await CheckPointModel.findOne({_id: id})
                .catch(() => {
                    throw { status: 404, msg: "Could not find data." };
                });

            if (!checkpoint)throw { status: 404, msg: "Could not find data." };

            // send notifications if doc hasn't been approved
            let notificationsSend = false;;
            if (!checkpoint.approved) {
                // calculate distance travelled
                const duckId = Types.ObjectId(checkpoint.duck);
    
                const duck: IDuck = await DuckModel.findOne({_id: duckId})
                    .catch(() => {
                        throw { status: 404, msg: "Could not find data" };
                    });
    
                let populatedDuck: IDuck = await duck.populate('checkPoints').execPopulate();
    
                const positions = populatedDuck.checkPoints.map((checkPoint: any) => checkPoint.position)
    
                const totalDistance = Utils.calculateTotalDistanceOfPositionArray(duck.startPosition, positions);

                populatedDuck = await populatedDuck.populate({path: 'checkPoints', populate: { path:'subscriber'}}).execPopulate();

                const subscribers: ISubscriber[] = populatedDuck.checkPoints.map((checkpoint: any) => checkpoint.subscriber);

                subscribers.forEach((subscriber) => {
                    if (subscriber) {
                        Utils.sendMail(
                            this.config.mail, 
                            `${duck.name} has been found!`, 
                            `<p>Hi! We're happy to notify you of the fact that our duck ${duck.name} has been found! <br> Right now this duck has traveled <strong>${totalDistance.toFixed(2)}km</strong></p><br><a href="https://duck-away.com/unsubscribe">I don't want to be notified about ${duck.name} anymore.</a>`,
                            subscriber.email
                        );
                        notificationsSend = true;
                    }
                })
            }

            // update doc to be approved
            checkpoint.approved = true;
            checkpoint.save();

            res.send({checkPointApproved: checkpoint.approved, notificationsSend});
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }
}

export default CheckPointController;