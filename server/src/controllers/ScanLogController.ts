import mongoose, { NextFunction, Request, Response } from 'express';
import { ScanLogModel } from '../models';
import { IScanLog } from 'src/models/types';

class ScanLogController {
    constructor() {

    }

    public new = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const duckId = req.body.verifiedDuckId;
            console.log(req.body)

            const newLog: IScanLog = new ScanLogModel({duck: duckId});


            newLog.save()
                .catch(() => {
                    throw { status: 404, msg: "Could not create scan" }
                } );


            res.send({logMade: true});
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    // public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //     try {
    //         console.log('dd')
    //         // get model
    //         const logs: IScanLog[] = await ScanLogModel.find()
    //             .catch(() => {
    //                 throw { status: 404, msg: "Could not find data" };
    //             });
    //         console.log(logs)

    //         if (!logs) throw { status: 404, msg: "Could not find data." };

    //         await Promise.all(logs.map(async(log) => {
    //             const populatedLog = await log.populate('duck').execPopulate();
    //             return populatedLog;
    //         }))



    //         res.send(logs);
    //     } catch (error) {
    //         const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
    //         console.log(log)
    //         res.status(error.status).send({message: error.msg});
    //     }
    // }

    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const { page , limit } = req.query;

            const options = {
                page: page || 1,
                limit: limit || 36,
                sort: '-createdAt'
            };


            const model : any = ScanLogModel;
            
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
            const logs = await model.aggregatePaginate(myAggregate, options);

            res.send({logs});
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    // public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //     try {

    //         const { id } = req.body;

    //         // get model
    //         await SubscriberModel.findOneAndDelete({_id: id})
    //             .catch(() => {
    //                 throw { status: 500, msg: "Could not delete data" };
    //             });

    //         res.send({deleted: true});
    //     } catch (error) {
    //         const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
    //         console.log(log)
    //         res.status(error.status).send({message: error.msg});
    //     }
    // }
}

export default ScanLogController;