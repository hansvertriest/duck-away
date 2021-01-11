import mongoose, { NextFunction, Request, Response } from 'express';
import { DuckModel, DuckModelKeys } from '../models';
import { Utils } from '../services';
import { IDuck, IDuckPublic, ICheckPoint } from '../models/types';

class DuckController {
    constructor() {

    }

    public newDuck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, description, startPosition, pictureName } = req.body;

            // filter props to existing keys
            const filteredProps = Utils.filterKeysAgainstModelKeys({
                name,
                description: description || 'This duck doesn\'t have a story yet!',
                startPosition,
                pictureName
            }, DuckModelKeys);

            if (!name || !startPosition) {
                throw { status: 412, msg: "Given data does not meet requirements" }
            }

            // create model
            const newDuck = new DuckModel(filteredProps);

            // save model
            const savedDuck = await newDuck.save()
                .catch((error) => {
                    console.log(error)
                    if (error.code == 11000) throw { status: 412, msg: "Duplicate duck name" };
                    throw { status: 500, msg: "Could not save data" };
                });

            res.send(savedDuck);
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    public updateDuck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id, changes } = req.body;

            if (!changes || !id) throw { status: 412, msg: "Given data does not meet requirements" }

            // filter changes to existing keys
            const filteredChanges = Utils.filterKeysAgainstModelKeys(changes, DuckModelKeys);

            // update model
            const update = await DuckModel.findOneAndUpdate({ _id: id }, filteredChanges, { new: true, useFindAndModify: false })
                .catch((error: any) => {
                    if (error.code == 11000) throw { status: 412, msg: "Duplicate duck name" };
                    throw { status: 500, msg: "Could not save data" };
                });

            if (!update) throw { status: 404, msg: "Could not find data" };

            res.send(update);
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    public submitDescription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id, descriptionSubmission } = req.body;

            // update model
            const update = await DuckModel.findOneAndUpdate({ _id: id }, { $push: { descriptionSubmissions: descriptionSubmission } }, { new: true, useFindAndModify: false })
                .catch(() => {
                    throw { status: 500, msg: "Could not save data" };
                });

            res.send(Utils.castDuckToPublic(update));
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    public getDuckPublic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;

            // get model
            const duck: IDuck = await DuckModel.findOne({ _id: id })
                .catch(() => {
                    throw { status: 404, msg: "Could not find data" };
                });

            if (!duck) throw { status: 404, msg: "Could not find data" };

            await duck.populate('team').execPopulate();

            res.send(Utils.castDuckToPublic(duck));
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    public getDucksPublic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            // get model
            const ducks: IDuck[] = await DuckModel.find()
                .catch(() => {
                    throw { status: 404, msg: "Could not find data" };
                });


            await Promise.all(ducks.map(async (duck) => {
                await duck.populate('team').execPopulate();
                return Utils.castDuckToPublic(duck)
            }));

            res.send({ducks});
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    public getDuckAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.body.verifiedDuckId || req.params.id;

            // get model
            const duck: IDuck = await DuckModel.findOne({ _id: id })
                .catch(() => {
                    throw { status: 404, msg: "Could not find data" };
                });

            if (!duck) throw { status: 404, msg: "Could not find data" };

            await duck.populate('checkPoints').execPopulate();
            await duck.populate('team').execPopulate();

            res.send(duck);
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    public getDuckTotalDistance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;

            // get model
            const duck: IDuck = await DuckModel.findOne({ _id: id })
                .catch(() => {
                    throw { status: 404, msg: "Could not find data" };
                });

            if (!duck) throw { status: 404, msg: "Could not find data" };

            const populatedDuck = await duck.populate('checkPoints').execPopulate();

            const positions = populatedDuck.checkPoints.map((checkPoint: any) => checkPoint.position)

            const totalDistance = Utils.calculateTotalDistanceOfPositionArray(duck.startPosition, positions);

            res.send({totalDistance});
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    public getDucksAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // get model
            const ducks: IDuck[] = await DuckModel.find()
                .catch(() => {
                    throw { status: 404, msg: "Could not find data" };
                });

            // populate checkpoints
            const populatedDucks = await Promise.all( ducks.map(async (duck) => {
                return await duck.populate('checkPoints').execPopulate();
            }));

            await Promise.all(ducks.map(async (duck) => {
                await duck.populate('team').execPopulate();
                await duck.populate('checkPoints').execPopulate();
                return duck
            }));

            res.send({ducks});
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
            await DuckModel.findOneAndDelete({_id: id})
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

    public getTotalDistance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const { id } = req.params;
            // find duck
            const duck: IDuck = await DuckModel.findOne({ _id: id });

            if (!duck) throw { status: 500, msg: "Duck not found" };

            const populatedDuck = await duck.populate('checkPoints').execPopulate();
            const positions = populatedDuck.checkPoints.map((checkPoint: any) => checkPoint.position)
            console.log(positions)

            let totalDistance: number;
            if (positions.length > 0) { 
                totalDistance = Utils.calculateTotalDistanceOfPositionArray(duck.startPosition, positions);
            }

            duck.totalDistance = totalDistance;
            duck.save();

            res.status(200).send({totalDistance});

        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    } 

    public getDistanceFromStart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const { id } = req.params;
            // find duck
            const duck: IDuck = await DuckModel.findOne({ _id: id });

            if (!duck) throw { status: 500, msg: "Duck not found" };

            const populatedDuck = await duck.populate('checkPoints').execPopulate();
            const positions = populatedDuck.checkPoints.map((checkPoint: any) => checkPoint.position)
            
            const latestPosition = (positions.length - 1 >= 0) ? positions[positions.length - 1] : undefined;
            if (latestPosition) {
                duck.distanceFromStart = Utils.calculateDistanceFromHome(duck.startPosition, positions[positions.length - 1]);
            } else {
                duck.distanceFromStart = 0;
            }
            
            duck.save();

            res.status(200).send({startPosition: duck.startPosition, latestPosition: positions[positions.length - 1], distance: duck.distanceFromStart});

        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    } 

}

export default DuckController;