import { Document, Types } from 'mongoose';

export interface IPicture extends Document {
    title: string;
    description: string;
    filename: string;
    _createdAt: number;
  }
interface IPosition {
    lat: number,
    lon: number,
}

interface ICheckPoint extends Document {
    _id: Types.ObjectId,
    duck: number,
    position: IPosition,
    pictureName: string,
    subscriber: Types.ObjectId,
    approved: Boolean
}

export interface IDuck extends Document {
    _id: Types.ObjectId,
    totalDistance: Number;
    distanceFromStart: Number;
    name: string,
    description: string,
    descriptionSubmissions: string[],
    startPosition: IPosition,
    checkPoints: Types.ObjectId[];
}

export interface IDuckPublic extends Document {
    _id: Types.ObjectId,
    totalDistance: Number;
    distanceFromStart: Number;
    name: string,
    description: string,
    descriptionSubmissions: string[],
    startPosition: IPosition,
}

export interface ITeam extends Document {
    _id: Types.ObjectId,
    ducks: IDuck[],
    description: string,
    descriptionSubmissions: string[],
    teamName: string,
}

export interface ITeamPublic extends Document {
    _id: Types.ObjectId,
    ducks: IDuckPublic[],
    description: string,
    descriptionSubmissions: string[],
    teamName: string,
}

export interface ISubscriber extends Document {
    duck: string;
    checkPoint: string;
    email: string;
}