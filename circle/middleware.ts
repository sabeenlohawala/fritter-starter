import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FollowCollection from '../follow/collection'
import CircleCollection from './collection';

/**
 * Checks if a circle with circlename and member as username in req.body with logged in user as owner exists
 */
 const isCircleAlreadyExists = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const member = await UserCollection.findOneByUsername(req.body.username);

    const circle = await CircleCollection.findOneMembership(req.body.circlename, userId, member._id);

    if (!circle){
        next();
        return;
    }

    res.status(409).json({
        error: `The user ${req.body.username} is already in the circle ${req.body.circlename}.`
    });
    return;
};

/**
 * Checks if a circle with circlename and member as username in req.params as following does not exist
 * for logged in user.
 */
 const isCircleMemberDoesNotExist = async(req: Request, res: Response, next: NextFunction) => {
    if (!req.params.circlename) {
        res.status(400).json({
          error: 'Provided circlename must be nonempty.'
        });
        return;
    }

    const userId = (req.session.userId as string) ?? '';
    const member = await UserCollection.findOneByUsername(req.params.username);
    const circle = await CircleCollection.findOneMembership(req.params.circlename, userId, member._id);

    if (!circle){
        res.status(404).json({
            error: {
                circleNotFound: `The user ${req.params.username} is not in a circle ${req.params.circlename}.`
            }
        });
        return;
    }
    next();
};

/**
 * Checks if user has any circle with circlename provided in req.params.
 */
const isCircleParamExists = async(req:Request, res:Response, next:NextFunction) => {
    if (!req.params.circlename){
        res.status(400).json({
            error: 'Provided circlename must be nonempty.'
        });
        return;
    }

    const userId = (req.session.userId as string) ?? '';
    const circle = await CircleCollection.findOne(req.params.circlename, userId);

    if (!circle){
        res.status(404).json({
            error: {
                circleNotFound: `The circle ${req.params.circlename} does not exist.`
            }
        });
        return;
    }
    next();
}

/**
 * Checks if user has any circle with circlename provided in req.query.
 */
const isCircleQueryExists = async(req:Request, res:Response, next:NextFunction) => {
    if (!req.query.circlename){
        res.status(400).json({
            error: 'Provided circlename must be nonempty.'
        });
        return;
    }

    const userId = (req.session.userId as string) ?? '';
    const circle = await CircleCollection.findOne(req.query.circlename as string, userId);

    if (!circle){
        res.status(404).json({
            error: {
                circleNotFound: `The circle ${req.query.circlename as string} does not exist.`
            }
        });
        return;
    }
    next();
}

/**
 * Checks if user has any circle with circlename provided in req.params.
 */
 const isOptionalCircleBodyExists = async(req:Request, res:Response, next:NextFunction) => {
    if (req.body.circlename){
        const userId = (req.session.userId as string) ?? '';
        const circle = await CircleCollection.findOne(req.body.circlename, userId);

        if (!circle){
            res.status(404).json({
                error: {
                    circleNotFound: `The circle ${req.body.circlename} does not exist.`
                }
            });
            return;
        }
    }
    next();
}

export{
    isCircleAlreadyExists,
    isCircleMemberDoesNotExist,
    isCircleParamExists,
    isCircleQueryExists,
    isOptionalCircleBodyExists,
}