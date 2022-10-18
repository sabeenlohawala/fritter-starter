import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Follower
 */

// Type definition for Follower on the backend
export type Follow = {
    follower: Types.ObjectId;
    following: Types.ObjectId;
};

export type PopulatedFollow = {
    follower: User;
    following: User;
  };

const FollowSchema = new Schema({
    // the user doing the following
    follower: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // the user being followed
    following: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;