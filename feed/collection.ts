import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from '../freet/model';
import FreetModel from '../freet/model';
import type {Mute} from '../mute/model';
import MuteModel from '../mute/model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import MuteCollection from '../mute/collection';
import FollowCollection from '../follow/collection';
import CircleCollection from '../circle/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FeedCollection {
    /**
     * Get all the freets in the database in the logged in user's feed according to mute role.
     *
     * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
     */
    static async findAll(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Freet>>> {
        const now = new Date();
        const user = await UserCollection.findOneByUserId(userId);
        const allFollowing = await FollowCollection.findAllFollowingByUserId(userId);
        const allCircles = await CircleCollection.findAll(userId);
        const relevantMutes = await MuteCollection.findAllRelevant(userId);

        // for each freet belonging to the userId's following, I need to check if any mute rule applies to it
        const allFreets:Array<HydratedDocument<Freet>> = []
        for (const follow of allFollowing){ // for each of the people the user follows
            const following = await UserCollection.findOneByUserId(follow.following._id);
            const followFreets = await FreetCollection.findAllByUsername(following.username)
            for (const freet of followFreets){ // for each of their freets
                let muteApplies = false;
                const authorName = (await UserCollection.findOneByUserId(freet.authorId)).username;
                for (const mute of relevantMutes){ // check if any mute rule applies
                    // if account is specified and account != author, ignore mute
                    // if circle is specified and author is not member of circle, ignore mute
                    // mute can have: P, A, C, P&A, P&C, A&C, P&A&C
                    let account = undefined;
                    let circle = undefined;
                    if (mute.account){
                        account = await UserCollection.findOneByUserId(mute.account._id); // account specified by the mute
                    }
                    if (mute.circlename){
                        circle = await CircleCollection.findOneMembership(mute.circlename,userId,freet.authorId); // circle specified by the mute
                    }

                    if (mute.phrase && mute.account && mute.circlename){
                        if ((account.username === authorName || circle) && freet.content.includes(mute.phrase)){
                            muteApplies = true;
                            break;
                        }
                    }
                    else if (mute.account && mute.circlename){
                        if (account.username === authorName || circle){
                            muteApplies = true;
                            break;
                        }
                    }
                    else if (mute.phrase && mute.circlename){
                        if (circle && freet.content.includes(mute.phrase)){
                            muteApplies = true;
                            break;
                        }
                    }
                    else if (mute.phrase && mute.account){
                        if (account.username === authorName && freet.content.includes(mute.phrase)){
                            muteApplies = true;
                            break;
                        }
                    }
                    else if (mute.circlename){
                        if (circle){
                            muteApplies = true;
                            break;
                        }
                    }
                    else if (mute.account){
                        if (account.username === authorName){
                            muteApplies = true;
                            break;
                        }
                    }
                    else if (mute.phrase){
                        if (freet.content.includes(mute.phrase)){
                            muteApplies = true;
                            break;
                        }
                    }
                }
                if (!muteApplies){
                    allFreets.push(freet);
                }
            }
        }

        return allFreets
    }

    
}

export default FeedCollection;
