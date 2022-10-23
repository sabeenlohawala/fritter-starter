import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Mute, PopulatedMute} from '../mute/model';

type MuteResponse = {
  _id: string;
  owner: string;
  dateCreated: string;
  phrase?: string;
  account?: string;
  circlename?: string;
  durationEnd?:string;
  startTime?:string;
  endTime?:string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Mute object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Mute>} mute - A mute
 * @returns {MuteResponse} - The mute object formatted for the frontend
 */
const constructMuteResponse = (mute: HydratedDocument<Mute>): MuteResponse => {
    const muteCopy: PopulatedMute = {
        ...mute.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
        })
    };
    const owner = muteCopy.owner.username;
    const account = !muteCopy.account? undefined : (muteCopy.account.username);
    const durationEnd = !muteCopy.durationEnd? undefined : formatDate(muteCopy.durationEnd);
    const startTime = !muteCopy.startTime? undefined : formatDate(muteCopy.startTime);
    const endTime = !muteCopy.startTime? undefined : formatDate(muteCopy.endTime);

    return {
        ...muteCopy,
        _id: muteCopy._id.toString(),
        owner: owner,
        dateCreated: formatDate(mute.dateCreated),
        account: account,
        durationEnd:durationEnd,
        startTime:startTime,
        endTime:endTime,
    };
};

export {
  constructMuteResponse
};
