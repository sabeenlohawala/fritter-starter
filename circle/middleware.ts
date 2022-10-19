import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FollowCollection from '../follow/collection'
import CircleCollection from './collection';

/**
 * Checks if a circle with circlename and member as username in req.body exists
 */
 const isCircleAlreadyExists = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const member = await UserCollection.findOneByUsername(req.body.username);

    const circle = await CircleCollection.findOne(req.body.circlename, userId, member._id);

    if (!circle){
        next();
        return;
    }

    res.status(409).json({
        error: `The user ${req.body.username} is already in the circle ${req.body.circlename}.`
    });
    return;
};

export{
    isCircleAlreadyExists,
}