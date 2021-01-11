import * as mongoose from 'mongoose'
import { Schema, Model } from 'mongoose';
import { ISubscriber } from './types';

const subscriberSchema: Schema = new Schema({
    checkPoint: {
        type: Schema.Types.ObjectId,
        ref: 'checkpoint',
        required: true
    },

    email: { type: String, required: true }
},
{
    timestamps:true
});

subscriberSchema.pre('save', () => {
});

const SubscriberModelKeys = Object.keys(subscriberSchema);

const SubscriberModel : Model<ISubscriber> = mongoose.model<ISubscriber>('subscriber', subscriberSchema);

export {
    SubscriberModelKeys,
    SubscriberModel,
    ISubscriber,
}