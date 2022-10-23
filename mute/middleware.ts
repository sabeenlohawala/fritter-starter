import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import MuteCollection from '../mute/collection';
import FollowCollection from '../follow/collection';
import CircleCollection from '../circle/collection';

/**
 * Checks if a mute with muteId is req.params exists
 */
const isMuteParamExists = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.muteId);
    const userId = (req.session.userId as string) ?? '';
    const mute = validFormat ? await MuteCollection.findOne(req.params.muteId) : '';
    if (!mute) {
        res.status(404).json({
        error: {
            muteNotFound: `Mute with mute ID ${req.params.muteId} does not exist.`
        }
        });
        return;
    }

    next();
};

/**
 * Checks if the current user is the owner of the mute whose muteId is in req.params
 */
 const isMuteOwner = async (req: Request, res: Response, next: NextFunction) => {
    const mute = await MuteCollection.findOne(req.params.muteId);
    const userId = mute.owner._id;
    if (req.session.userId !== userId.toString()) {
      res.status(403).json({
        error: 'Cannot modify other users\' mutes.'
      });
      return;
    }
  
    next();
};

const isMuteBodyValid = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const phrase = req.body.phrase;
    const user = (req.body.account)? await UserCollection.findOneByUsername(req.body.account) : undefined;
    const account = user? user._id : undefined;
    const circlename = req.body.circlename;

    if (!phrase && !account && !circlename){
        res.status(400).json({
            error: {
                invalidMute: `Mute must contain a word/phrase, an active account, or existing circlename.`
            }
            });
            return;
    }

    if (circlename){
        const circle = await CircleCollection.findOne(circlename,userId);
        if (!circle){
            res.status(400).json({
                error: {
                    circleNotFound: `The specified circle does not exist.`
                }
            });
            return;
        }
    }

    if (account){
        const follow = await FollowCollection.findOne(userId,account);
        if (!follow){
            res.status(400).json({
                error: {
                    followNotFound: `You are not following account ${req.body.account}.`
                }
            });
            return;
        }
    }
    next();
}

export{
    isMuteParamExists,
    isMuteOwner,
    isMuteBodyValid,
}