import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Circle
 */

// Type definition for Cricle on the backend
export type Circle = {
    circlename: string,
    owner: Types.ObjectId;
    member: Types.ObjectId;
};

export type PopulatedCircle = {
    circlename:string
    owner: User;
    member: User;
};

const CircleSchema = new Schema({
    // the name of the circle
    circlename: {
        type: String,
        required: true
    },
    // the user who the circle belongs to
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // the user who is part of the circle
    member: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
});

const CircleModel = model<Circle>('Circle', CircleSchema);
export default CircleModel;