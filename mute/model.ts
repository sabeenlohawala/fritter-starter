import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Mute
 */

// Type definition for Mute on the backend
export type Mute = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  owner: Types.ObjectId;
  dateCreated: Date;
  phrase?:string;
  account?: Types.ObjectId;
  circlename?:string;
  durationEnd?: Date;
  startTime?: Date;
  endTime?: Date;
};

export type PopulatedMute = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  owner: User;
  dateCreated: Date;
  phrase?: string;
  account?: User;
  circlename?:string;
  durationEnd?: Date;
  startTime?: Date;
  endTime?: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Mutes stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const MuteSchema = new Schema<Mute>({
  // The owner
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the mute was created
  dateCreated: {
    type: Date,
    required: true
  },
  phrase: {
    type: String,
    required: false
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  circlename: {
    type: String,
    required: false
  },
  durationEnd: {
    type: Date,
    required: false
  },
  startTime: {
    type: Date,
    required: false
  },
  endTime: {
    type: Date,
    required: false
  },
});

const MuteModel = model<Mute>('Mute', MuteSchema);
export default MuteModel;