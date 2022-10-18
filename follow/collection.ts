import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';
import UserCollection from '../user/collection';
import FreetModel from '../freet/model';

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

    /**
     * Find a follow by follower and following
     *
     */
    static async findOne(follower: Types.ObjectId | string, following: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
        return FollowModel.findOne({follower: follower, following: following});
    }

    /**
     * Find all the Follows for people who follow User (following = userId)
     *
     * @param {string} userId - The userId whose followers we want to find
     * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
     */
    static async findAllFollowersByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
        return FollowModel.find({following: userId}).populate('following');
    }

    /**
     * Find all the Follows for people who follow User (following = userId)
     *
     * @param {string} userId - The userId whose followers we want to find
     * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
     */
     static async findAllFollowingByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
        return FollowModel.find({follower: userId}).populate('follower');
    }
}

export default FollowCollection;