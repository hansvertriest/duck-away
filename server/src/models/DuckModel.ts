import * as mongoose from 'mongoose'
import { Schema, Model } from 'mongoose';
import { IDuck } from './types';

const duckSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true},
    description: { type: String },
    totalDistance: { type: Number, default: 0 },
    distanceFromStart: { type: Number, default: 0 },
    startPosition: {
        lat: { type: Number, required: true, },
        lon: { type: Number, required: true, },
    },
    checkPoints: [{
        type: Schema.Types.ObjectId,
        ref: 'checkpoint',
    }],
    team: {
        type: Schema.Types.ObjectId,
        ref: 'team',
    },
    pictureName: {type: String},
},
{
    timestamps:true
});

const DuckModelKeys = Object.keys(duckSchema);

const DuckModel : Model<IDuck> = mongoose.model<IDuck>('duck', duckSchema);

export {
    DuckModelKeys,
    DuckModel,
    IDuck,
}