import mongoose, { NextFunction, Request, Response } from 'express';
import { SubscriberModel, SubscriberModelKeys, CheckPointModel, ISubscriber, ICheckPoint } from '../models';
import { Utils } from '../services';

class SubscriberController {
    constructor() {

    }

    public subscribe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const duckId = req.body.verifiedDuckId;
            const { checkPoint, email } = req.body;

            // filter props to existing keys
            const filteredProps = Utils.filterKeysAgainstModelKeys({
                checkPoint,
                email,
            }, SubscriberModelKeys);

            if (!duckId || !checkPoint || !email) {
                throw { status: 412, msg: "Given data does not meet requirements" }
            }

            // find duck
            const checkPointDoc: ICheckPoint = await CheckPointModel.findOne({ _id: checkPoint })
                .catch(() => {
                    throw { status: 404, msg: "Could not find data" };
                });

            if (!checkPointDoc) throw { status: 404, msg: "Could not find data" };
            if (checkPointDoc.duck != duckId) throw { status: 404, msg: "Given data does not meet requirements" };


            // create model
            const newSubscriber = new SubscriberModel(filteredProps);

            // save model
            await newSubscriber.save()
                .catch((error) => {
                    const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
                    console.log(log)
                    if (error.code == 11000) throw { status: 412, msg: "Duplicate duck name" };
                    throw { status: 500, msg: "Could not save data" };
                });

            // update checkPoint
            checkPointDoc.subscriber = newSubscriber._id;
            checkPointDoc.save();

            res.send({isSubscribed: true});
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // get model
            const subscribers: ISubscriber[] = await SubscriberModel.find()
                .catch(() => {
                    throw { status: 404, msg: "Could not find data" };
                });

            if (!subscribers) throw { status: 404, msg: "Could not find data" };

            await Promise.all(subscribers.map(async(subscriber) => {
                const populatedSubscriber = await subscriber.populate({path:'checkPoint', populate : { path:'duck'}}).execPopulate();
                return populatedSubscriber;
            }))



            res.send(subscribers);
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const { id } = req.body;

            // get model
            await SubscriberModel.findOneAndDelete({_id: id})
                .catch(() => {
                    throw { status: 500, msg: "Could not delete data" };
                });

            res.send({deleted: true});
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }
}

export default SubscriberController;