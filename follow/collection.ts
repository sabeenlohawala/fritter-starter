import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';
import UserCollection from '../user/collection';
import FreetModel from 'freet/model';

class FollowCollection{
    /**
     * Follow a user.
     */
    static async addOne(follower: Types.ObjectId | string, following: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
        const follow = new FollowModel({
            follower,
            following
        });
        await follow.save()
        return follow
    }

    /**
     * Unfollow a user or remove a user from your followers.
     * @param follower - The follower in the follow relationship
     * @param following - the user being followed in the follow relationship
     * @returns 
     */
    static async deleteOne(follower: Types.ObjectId | string, following: Types.ObjectId | string): Promise<boolean>{
        const follow = await FollowModel.deleteOne({follower: follower, following: following});
        return follow !== null;
    }

    /**
     * Delete all follow relationships containing the user
     * @param user - the user whose relationships are to be deleted
     */
    static async deleteMany(user: Types.ObjectId | string): Promise<void>{
        await FreetModel.deleteMany({follower: user});
        await FreetModel.deleteMany({following: user});
    }
}

export default FollowCollection;