import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FollowCollection from '../follow/collection'


/**
 * Checks if a follow with userId as username in req.params exists
 */
 const isFollowAlreadyExists = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const following = await UserCollection.findOneByUsername(req.body.username);

    const follow = await FollowCollection.findOne(userId, following._id);

    if (!follow){
        next();
        return;
    }

    res.status(409).json({
        error: `The follow relation already exists.`
    });
    return;
};

const isFollowDoesNotExist = async(req: Request, res: Response, next: NextFunction) => {
    console.log('follow')
    const userId = (req.session.userId as string) ?? '';
    const following = await UserCollection.findOneByUsername(req.params.username);
    const follow = await FollowCollection.findOne(userId, following._id);

    if (!follow){
        res.status(404).json({
            error: {
                followNotFound: `Follow relation does not exist.`
            }
        });
        return;
    }
    next();
};

const isFollowerDoesNotExist = async(req: Request, res: Response, next: NextFunction) => {
    console.log('follow')
    const userId = (req.session.userId as string) ?? '';
    const following = await UserCollection.findOneByUsername(req.params.username);
    const follow = await FollowCollection.findOne(following._id,userId);

    if (!follow){
        res.status(404).json({
            error: {
                followNotFound: `Follow relation does not exist.`
            }
        });
        return;
    }
    next();
};

  export {
    isFollowAlreadyExists,
    isFollowDoesNotExist,
    isFollowerDoesNotExist
  };