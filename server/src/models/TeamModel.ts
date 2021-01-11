import * as mongoose from 'mongoose'
import { Schema, Model } from 'mongoose';
import { ITeam } from './types';

const teamSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true},
    ducks:[{
        type: Schema.Types.ObjectId,
        ref: 'duck',
    }],
    description: { type: String },
    descriptionSubmissions: [{ type: String}],
},
{
    timestamps:true
});

// teamSchema.pre('save', () => {
//     if (!this.description) this.description = ""
//     if (!this.pictureName) this.pictureName = ""
//     if (!this.descriptionSubmissions) this.descriptionSubmissions = [];
// });

const TeamModelKeys = Object.keys(teamSchema);

const TeamModel : Model<ITeam> = mongoose.model<ITeam>('team', teamSchema);

export {
    TeamModelKeys,
    TeamModel,
    ITeam,
}