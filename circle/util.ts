import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Circle, PopulatedCircle} from '../circle/model';

type CircleResponse = {
    circlename: string;
    owner: string;
    member: string;
};

/**
 * Transform a raw Circle object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Circle>} circle - A circle
 * @returns {CircleResponse} - The circle object formatted for the frontend
 */
const constructCircleResponse = (circle: HydratedDocument<Circle>): CircleResponse => {
    const circleCopy: PopulatedCircle = {
        ...circle.toObject({
            versionKey:false
        })
    };

    const circlename = circleCopy.circlename;
    const owner = circleCopy.owner.username;
    const member = circleCopy.member.username;

    return{
        ...circleCopy,
        circlename: circlename,
        owner: owner,
        member: member
    };
};

export {
    constructCircleResponse
};