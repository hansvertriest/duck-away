import mongoose, { NextFunction, Request, Response } from 'express';
import { TeamModel, TeamModelKeys, DuckModel } from '../models';
import { Utils } from '../services';
import { ITeam, ITeamPublic } from '../models/types';

class TeamController {
    constructor() {

    }

    public new = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, description } = req.body;

            // filter props to existing keys
            const filteredProps = Utils.filterKeysAgainstModelKeys({
                name,
                description: description || 'This team doesn\'t have a story yet!',
            }, TeamModelKeys);

            if (!name) {
                throw { status: 412, msg: "Given data does not meet requirements" }
            }

            // create model
            const newTeam = new TeamModel(filteredProps);

            // save model
            const savedModel = await newTeam.save()
                .catch((error) => {
                    console.log(error)
                    if (error.code == 11000) throw { status: 412, msg: "Duplicate duck name" };
                    throw { status: 500, msg: "Could not save data" };
                });

            res.send(savedModel);
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id, changes } = req.body;

            if (!changes || !id) throw { status: 412, msg: "Given data does not meet requirements" }

            // filter changes to existing keys
            const filteredChanges = Utils.filterKeysAgainstModelKeys(changes, TeamModelKeys);

            // update model
            const update = await TeamModel.findOneAndUpdate({ _id: id }, filteredChanges, { new: true, useFindAndModify: false })
                .catch((error: any) => {
                    if (error.code == 11000) throw { status: 412, msg: "Duplicate duck name" };
                    throw { status: 500, msg: "Could not save data" };
                });
            res.send(update);
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    public addDuck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id, duckId } = req.body;

            if (!duckId || !id) throw { status: 412, msg: "Given data does not meet requirements" }

            // update model
            const update: ITeam = await TeamModel.findOneAndUpdate({ _id: id }, { '$push' : { 'ducks': duckId } }, { new: true, useFindAndModify: false })
                .catch((error: any) => {
                    if (error.code == 11000) throw { status: 412, msg: "Duplicate duck name" };
                    throw { status: 500, msg: "Could not save data" };
                });

            // update duck
            await DuckModel.findOneAndUpdate({ _id: duckId }, {  'team': update._id  }, { new: true, useFindAndModify: false })
                .catch((error: any) => {
                    if (error.code == 11000) throw { status: 412, msg: "Duplicate duck name" };
                    throw { status: 500, msg: "Could not save data" };
                });
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
            const update = await TeamModel.findOneAndUpdate({ _id: id }, { $push: { descriptionSubmissions: descriptionSubmission } }, { new: true, useFindAndModify: false })
                .catch((error: any) => {
                    console.log(error)
                    throw { status: 500, msg: "Could not save data" };
                });

            res.send(update);
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    public getByIdPublic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;

            // get model
            const team: ITeam = await TeamModel.findOne({ _id: id })
                .catch(() => {
                    throw { status: 404, msg: "Could not find data" };
                });


            if (!team) throw { status: 404, msg: "Could not find data" };

            const populatedTeam = await team.populate({
                path: 'ducks',
                populate: {
                    path: 'checkPoints'
                }
            }).execPopulate();

            // make populated ducks public
            populatedTeam.ducks.map((duck) => Utils.castDuckToPublic(duck) );

            res.send(populatedTeam);
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    public getAllPublic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            // get model
            const teams: ITeam[] = await TeamModel.find()
                .catch(() => {
                    throw { status: 404, msg: "Could not find data" };
                });

            // populate teams so ducks => DuckPublic
            const populatedTeams = await Promise.all(teams.map(async (team) => {
                const populatedTeam = await team.populate({
                        path: 'ducks',
                        populate: {
                            path: 'checkPoints'
                        }
                    }).execPopulate();
                    const populatedPublicTeam: ITeamPublic = populatedTeam;
                    populatedPublicTeam.ducks = populatedTeam.ducks.map((duck) => Utils.castDuckToPublic(duck));
                    return populatedPublicTeam;
            }));

            res.send({teams: populatedTeams});
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    public getByDuckIdAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.body.verifiedDuckId || req.params.id;

            // get model
            const team: ITeam = await TeamModel.findOne({ ducks: { '$in' : [id]} })
                .catch(() => {
                    throw { status: 404, msg: "Could not find data" };
                });

            if (!team) throw { status: 404, msg: "Could not find data" };

            const populatedTeam = await team.populate({
                path: 'ducks',
                populate: {
                    path: 'checkPoints'
                }
            }).execPopulate();

            res.send(populatedTeam);
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    public getByIdAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;

            // get model
            const team: ITeam = await TeamModel.findOne({ _id: id })
                .catch(() => {
                    throw { status: 404, msg: "Could not find data" };
                });


            if (!team) throw { status: 404, msg: "Could not find data" };

            const populatedTeam = await team.populate({
                path: 'ducks',
                populate: {
                    path: 'checkPoints'
                }
            }).execPopulate();

            res.send(populatedTeam);
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }

    public getAllAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // get model
            const teams: ITeam[] = await TeamModel.find()
                .catch(() => {
                    throw { status: 404, msg: "Could not find data" };
                });

            // populate ducks
            const populatedTeam = await Promise.all(teams.map(async (team) => {
                return await team.populate('ducks').execPopulate();
            }));

            res.send({teams: populatedTeam});
        } catch (error) {
            const log = (error.msg) ? `!!! ERROR ${error.msg}` : error;
            console.log(log)
            res.status(error.status).send({message: error.msg});
        }
    }
}

export default TeamController;