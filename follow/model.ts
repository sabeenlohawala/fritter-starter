import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Follower
 */

// Type definition for Follower on the backend
export type Follow = {
    // from follows to
    follower: Types.ObjectId;
    following: Types.ObjectId;
};

const FollowSchema = new Schema({
    // The user doing the following of "to"
    follower: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // the user that is followed by "from"
    following: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;