import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import MuteCollection from '../mute/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as muteValidator from '../mute/middleware';
import * as util from './util';
import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Create a new mute.
 *
 * @name POST /api/mutes
 *
 * @param {string} content - The content of the freet
 * @return {MuteResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
 router.post(
    '/',
    [
      userValidator.isUserLoggedIn,
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const phrase = req.body.phrase;
        const user = (req.body.account)? await UserCollection.findOneByUsername(req.body.account) : undefined;
        const account = user? user._id : undefined;
        const circlename = req.body.circlename;

        if (!phrase && !account && !circlename){
            res.status(400).json({
                error: {
                    freetNotFound: `Mute must contain a word/phrase, account, or circle.`
                }
              });
              return;
        }

        // set up durationEnd
        const durationHours = (req.body.durationHours) ? req.body.durationHours : undefined;
        const durationMins = (req.body.durationMins) ? req.body.durationMins : undefined;
        let duration:[string,string] | undefined = undefined
        if (durationHours || durationMins){
            duration = [durationHours? durationHours : '0',durationMins? durationMins: '0'];
        }

        // set up startHoursMins
        const startHours = (req.body.startHours) ? req.body.startHours : undefined;
        const startMins = (req.body.startMins) ? req.body.startMins : undefined;
        let startHoursMins:[string,string] | undefined = undefined;
        if (startHours || startMins){
            startHoursMins = [startHours?startHours : '0', startMins?startMins : '0']
        }
        // set up endHoursMins
        const endHours = (req.body.endHours) ? req.body.endHours : undefined;
        const endMins = (req.body.endMins) ? req.body.endMins : undefined;
        let endHoursMins:[string,string] | undefined = undefined;
        if (endHours || endMins){
            endHoursMins = [endHours?endHours : '0', endMins?endMins : '0']
        }

        const mute = await MuteCollection.addOne(userId,phrase,account,circlename,duration,startHoursMins,endHoursMins);
    
        res.status(201).json({
            message: 'Your mute was created successfully.',
            freet: util.constructMuteResponse(mute)
        });
    }
);

/**
 * Delete a mute.
 *
 * @name DELETE /api/mutes/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
 router.delete(
    '/:muteId?',
    [
        userValidator.isUserLoggedIn,
        muteValidator.isMuteParamExists,
        muteValidator.isMuteOwner,
    ],
    async (req: Request, res: Response) => {
        await MuteCollection.deleteOne(req.params.muteId);
        res.status(200).json({
            message: 'Your mute was deleted successfully.'
        });
    }
);

/**
 * Get all the mutes of the logged in user.
 *
 * @name GET /api/mutes
 *
 * @return {MuteResponse[]} - A list of all the mutes where the 
 *                            logged in user is the owner
 */
 router.get(
    '/',
    [
      userValidator.isUserLoggedIn,
    ],
    async (req: Request, res: Response) => {
      const mutes = await MuteCollection.findAll(req.session.userId as string ?? '');
      const response = mutes.map(util.constructMuteResponse);
      res.status(200).json(response);
    }
  );


// update mute rule (change word/phrase, change account, change circle, change duration, change time period)
// get all mutes

export {router as muteRouter};