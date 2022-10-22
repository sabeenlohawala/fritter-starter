import type {HydratedDocument, Types} from 'mongoose';
import type {Mute} from './model';
import MuteModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore mutes
 * stored in MongoDB, including adding, finding, updating, and deleting mutes.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Mute> is the output of the MuteModel() constructor,
 * and contains all the information in Mute. https://mongoosejs.com/docs/typescript.html
 */
class MuteCollection{
    /**
     * Add a mute to the collection
     *
     * @param {string} owner - The owner of the mute
     * @return {Promise<HydratedDocument<Mute>>} - The newly created mute
     */
    static async addOne(owner: Types.ObjectId | string,
                        phrase?:string | undefined,
                        account?: Types.ObjectId | string, 
                        circlename?:string | undefined,
                        duration?:[string,string] | undefined,
                        startHoursMins?:[string,string] | undefined,
                        endHoursMins?:[string,string] | undefined): Promise<HydratedDocument<Mute>> {
        const date = new Date();
        // format durationEnd time
        let durationEnd = undefined;
        if (duration !== undefined && (duration[0] !== '' || duration[1] !=='')){
            durationEnd = new Date();
            durationEnd.setHours(durationEnd.getHours() + parseInt(duration[0]));
            durationEnd.setMinutes(durationEnd.getMinutes() + parseInt(duration[1]));
        }
        // format start time and end time
        let startTime = undefined;
        if (startHoursMins !== undefined && (startHoursMins[0] != '' || startHoursMins[1] !== '')){
            startTime = new Date();
            startTime.setHours(parseInt(startHoursMins[0]));
            startTime.setMinutes(parseInt(startHoursMins[1]));
        }
        let endTime = undefined;
        if (endHoursMins !== undefined && (endHoursMins[0] != '' || endHoursMins[1] !== '')){
            endTime = new Date();
            endTime.setHours(parseInt(endHoursMins[0]));
            endTime.setMinutes(parseInt(endHoursMins[1]));
        }
        // must have a valid start time and end time to have valid mute period
        if (startTime === undefined && endTime !== undefined || startTime !== undefined && endTime === undefined){
            startTime = undefined;
            endTime = undefined;
        }
        const mute = new MuteModel({
            owner,
            dateCreated: date,
            phrase: phrase,
            account: account,
            circlename: circlename,
            durationEnd:durationEnd,
            startTime:startTime,
            endTime:endTime
        });
        await mute.save(); // Saves freet to MongoDB
        return mute.populate(['owner','account','durationEnd']);
    }
}

export default MuteCollection;