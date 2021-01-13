import * as mongoose from 'mongoose'
import { Schema, Model } from 'mongoose';
import { default as aggregatePaginate }  from 'mongoose-aggregate-paginate-v2';
import { IScanLog } from './types';

const scanLogSchema: Schema = new Schema({
    duck: { type: Schema.Types.ObjectId,  ref: 'duck' },
},
{
    timestamps:true
});


scanLogSchema.plugin(aggregatePaginate);

const ScanLogModel : Model<IScanLog> = mongoose.model<IScanLog>('scanlog', scanLogSchema);

export {
    scanLogSchema,
    ScanLogModel,
    IScanLog,
}