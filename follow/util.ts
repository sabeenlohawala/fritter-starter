import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Follow, PopulatedFollow} from '../follow/model';

type FollowerResponse = {
    follower: string;
    following: string;
};

/**
 * Transform a raw Follower object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Follow>} follow - A follow
 * @returns {FollowerResponse} - The follow object formatted for the frontend
 */
const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowerResponse => {
    const followCopy: PopulatedFollow = {
        ...follow.toObject({
            versionKey:false
        })
    };

    const follower = followCopy.follower.username;
    const following = followCopy.following.username;

    return{
        ...followCopy,
        follower: follower,
        following: following
    };
};

export {
    constructFollowResponse
};