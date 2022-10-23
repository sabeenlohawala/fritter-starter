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
        const durationEnd = this.formatDurationEnd(duration);
        let startTime = this.formatTimePeriod(startHoursMins);
        let endTime = this.formatTimePeriod(endHoursMins);

        // must have a valid start time and end time to have valid mute period
        if (startTime === undefined && endTime !== undefined || startTime !== undefined && endTime === undefined){
            startTime = undefined;
            endTime = undefined;
        }
        // else if(startTime < endTime){
        //     // if endTime < startTime
        //     endTime.setTime(endTime.getTime() + 24*60*60*1000)
        // }
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

    /**
     * Delete a mute with given muteId.
     *
     * @param {string} muteId - The freetId of freet to delete
     * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
     */
    static async deleteOne(muteId: Types.ObjectId | string): Promise<boolean> {
        const mute = await MuteModel.deleteOne({_id: muteId});
        return mute !== null;
    }
    
    /**
     * Delete all the mutes 
     */
    static async deleteMany(owner:Types.ObjectId | string): Promise<void> {
        await MuteModel.deleteMany({owner:owner});
    }

    /**
     * Find a freet by freetId
     *
     * @param {string} muteId - The id of the freet to find
     * @return {Promise<HydratedDocument<Mute>> | Promise<null> } - The freet with the given freetId, if any
     */
    static async findOne(muteId: Types.ObjectId | string): Promise<HydratedDocument<Mute>> {
        return MuteModel.findOne({_id: muteId}).populate(['owner','account']);
    }

    /**
     * Get all the mutes belonging to the owner in the database
     *
     * @return {Promise<HydratedDocument<Mute>[]>} - An array of all of the freets
     */
    static async findAll(owner: Types.ObjectId | string): Promise<Array<HydratedDocument<Mute>>> {
        // Retrieves freets and sorts them from most to least recent
        return MuteModel.find({owner: owner}).populate(['owner','account']);
    }

    static formatDurationEnd(duration:[string,string] | undefined) : Date | undefined {
        let durationEnd = undefined;
        if (duration !== undefined && (duration[0] !== '' || duration[1] !=='')){
            durationEnd = new Date();
            durationEnd.setHours(durationEnd.getHours() + parseInt(duration[0]));
            durationEnd.setMinutes(durationEnd.getMinutes() + parseInt(duration[1]));
        }
        return durationEnd
    }

    static formatTimePeriod(timeHoursMins:[string,string] | undefined) : Date | undefined {
        let time = undefined;
        if (timeHoursMins !== undefined && (timeHoursMins[0] != '' || timeHoursMins[1] !== '')){
            time = new Date();
            time.setHours(parseInt(timeHoursMins[0]));
            time.setMinutes(parseInt(timeHoursMins[1]));
        }
        return time;
    }
}

export default MuteCollection;