import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from 'user/collection';
import MuteCollection from '../mute/collection';

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

export{
    isMuteParamExists,
    isMuteOwner,
}