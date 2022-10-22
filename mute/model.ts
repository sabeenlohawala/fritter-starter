import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Circle, PopulatedCircle} from '../circle/model';

/**
 * This file defines the properties stored in a Circle
 */

// Type definition for Mute on the backend
export type Mute = {
    owner: Types.ObjectId;
    dateCreated: Date;
    phrase: string;
    user: Types.ObjectId;
    circle: Types.ObjectId;
    duration: Date;
    day: string;
    startTime: Date;
    endTime: Date;
};

export type PopulatedMute = {
    owner:User;
    dateCreated: Date;
    phrase: string;
    user: User;
    circle: User;
    duration: Date;
    day: string;
    startTime: Date;
    endTime: Date;
};

const MuteSchema = new Schema({
    // the user who the Mute belongs to
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // The date the mute was created
    dateCreated: {
        type: Date,
        required: true
    },

    // the word or phrase to mute
    phrase: {
        type: String,
        required: false
    },

    // the user who is part of the circle
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false
    },

    // the user who is part of the circle
    circle: {
        type: Schema.Types.ObjectId,
        ref: "Circle",
        required: false
    },

    // The duration during which to mute starting from dateCreated
    duration: {
        type: Date,
        required: false
    },

    // the day of the week to mute
    day: {
        types: Date,
        required: false
    },

    // the startTime of the mute period
    startTime: {
        types: Date,
        required: false
    },

    // the end time of the mute period
    endTime: {
        types: Date,
        required: false
    }
});

const MuteModel = model<Mute>('Mute', MuteSchema);
export default MuteModel;