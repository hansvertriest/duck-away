import * as mongoose from 'mongoose'
import { Schema, Model } from 'mongoose';
import { default as aggregatePaginate }  from 'mongoose-aggregate-paginate-v2';
import { ICheckPoint } from './types';

const checkPointSchema: Schema = new Schema({
    duck: {  type: Schema.Types.ObjectId, ref: 'duck', },
    position: {
        lat: { type: Number, required: true, },
        lon: { type: Number, required: true, },
    },
    pictureName: { type: String, required: true, },
    subscriber: {  type: Schema.Types.ObjectId, ref: 'subscriber' },
    approved: { type: Boolean, default: false },
    totalDistance: { type: Number, default: 0 },
    distanceFromStart: { type: Number, default: 0 },
},
{
    timestamps:true
});

checkPointSchema.plugin(aggregatePaginate);

const CheckPointModelKeys = Object.keys(checkPointSchema);

const CheckPointModel : Model<ICheckPoint> = mongoose.model<ICheckPoint>('checkpoint', checkPointSchema);

export {
    CheckPointModelKeys,
    CheckPointModel,
    ICheckPoint,
}