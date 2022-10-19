import type {HydratedDocument, Types} from 'mongoose';
import type {Circle} from './model';
import CircleModel from './model';
import UserCollection from '../user/collection';
import FreetModel from '../freet/model';
import FollowModel from '../follow/model';
import UserModel from '../user/model';

class CircleCollection{
    /**
     * Add a user to a circle.
     */
     static async addOne(circlename: string, owner: Types.ObjectId | string, member: Types.ObjectId | string): Promise<HydratedDocument<Circle>> {
        const circle = new CircleModel({
            circlename,
            owner,
            member
        });
        await circle.save()
        return circle
    }

    /**
     * Remove a user from a circle.
     * 
     * @param circlename - the name of the circle from which to remove a user
     * @param owner - the owner of the circle
     * @param member - the member to remove from the circle
     * @returns 
     */
    static async deleteOne(circlename: string, owner: Types.ObjectId | string, member: Types.ObjectId | string): Promise<boolean>{
        const circle = await CircleModel.deleteOne({circlename:circlename, owner:owner, member:member});
        return circle !== null;
    }

    /**
     * Delete all circles (i.e. all circle memberships with circlename and owner).
     * @param circlename - the name of the circle to be deleted
     * @param owner - the user whose relationships are to be deleted
     */
     static async deleteManyByOwner(owner: Types.ObjectId | string): Promise<void>{
        await CircleModel.deleteMany({owner: owner});
    }

    /**
     * Delete entire circle (i.e. all circle memberships with circlename and owner).
     * @param circlename - the name of the circle to be deleted
     * @param owner - the user whose relationships are to be deleted
     */
     static async deleteManyByOwnerAndName(circlename: string, owner: Types.ObjectId | string): Promise<void>{
        await CircleModel.deleteMany({circlename: circlename, owner: owner});
    }

    /**
     * Delete entire circle (i.e. all circle memberships with circlename and owner).
     * @param circlename - the name of the circle to be deleted
     * @param owner - the user whose relationships are to be deleted
     */
     static async deleteManyByOwnerAndMember(owner: Types.ObjectId | string, member: Types.ObjectId | string): Promise<void>{
        await CircleModel.deleteMany({owner: owner, member: member});
    }

    /**
     * Delete member from all circles that exist.
     * @param member - the user whose circles are to be deleted
     */
     static async deleteManyByMember(member: Types.ObjectId | string): Promise<void>{
        await CircleModel.deleteMany({member: member});
    }

    /**
     * Find a circle by circlename, owner, and member
     *
     * @param circlename - the name of the circle
     * @param owner - the user that is the owner of the circle
     * @param member - the user that is a member of the circle
     * @returns a circle obeying the above relationship
     */
     static async findOneMembership(circlename: string, owner: Types.ObjectId | string, member: Types.ObjectId | string): Promise<HydratedDocument<Circle>> {
        return CircleModel.findOne({circlename: circlename, owner: owner, member: member});
    }

    /**
     * Find a circle by circlename, owner, and member
     *
     * @param circlename - the name of the circle
     * @param owner - the user that is the owner of the circle
     * @param member - the user that is a member of the circle
     * @returns a circle obeying the above relationship
     */
     static async findOne(circlename: string, owner: Types.ObjectId | string): Promise<HydratedDocument<Circle>> {
        return CircleModel.findOne({circlename: circlename, owner: owner});
    }

    /**
     * Get all the circles of the user logged in
     *
     * @return {Promise<HydratedDocument<Circle>[]>} - An array of all of the circles
     */
    static async findAll(owner:Types.ObjectId | string): Promise<Array<HydratedDocument<Circle>>> {
        return CircleModel.find({owner: owner}).populate(['owner','member']);
    }

    /**
     * Get all the circles of the user logged in
     *
     * @return {Promise<HydratedDocument<Circle>[]>} - An array of all of the circles
     */
     static async findAllByCirclename(circlename: string, owner:Types.ObjectId | string): Promise<Array<HydratedDocument<Circle>>> {
        return CircleModel.find({circlename:circlename, owner: owner}).populate(['owner','member']);
    }

    /**
     * Get all the circles containing the member
     *
     * @param {string} username - The username of member in circles
     * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the circles
    */
    static async findAllByMember(owner: Types.ObjectId | string, username: string): Promise<Array<HydratedDocument<Circle>>> {
        const member = await UserCollection.findOneByUsername(username);
        return CircleModel.find({owner:owner, member: member}).populate(['owner','member']);
    }
}

export default CircleCollection;