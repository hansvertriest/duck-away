import * as mongoose from 'mongoose'
import { Schema, Model } from 'mongoose';
import { IPicture } from './types';

const pictureSchema: Schema = new Schema({
  filename: {
		type: String,
		required: true,
	},
  _createdAt: {
	type: Number,
	required: true,
	default: () => { return new Date() }
	},
},
{
    timestamps:true
});

const PictureModel = mongoose.model<IPicture>('Picture', pictureSchema);

export { PictureModel, IPicture, pictureSchema };
