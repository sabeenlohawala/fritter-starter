import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware'
import * as util from './util';

const router = express.Router();

/**
 * Follow a user
 * 
 * @name POST /api/follows
 * @return {FollowResponse}
 */

router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        userValidator.isUserExists,
        followValidator.isFollowAlreadyExists
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const following = await UserCollection.findOneByUsername(req.body.username);
        const follow = await FollowCollection.addOne(userId,following._id);

        res.status(201).json({
            message: `You followed ${req.body.username} successfully.`,
            follow: util.constructFollowResponse(follow)
        });
    }
);

/**
 * Unfollow a user.
 */
router.delete(
    '/following/:username?',
    [
        userValidator.isUserLoggedIn,
        userValidator.isUserParamExists,
        followValidator.isFollowDoesNotExist,
    ],
    async (req: Request, res: Response) => {
        console.log('inside')
        const userId = (req.session.userId as string) ?? '';
        const following = await UserCollection.findOneByUsername(req.params.username);
        await FollowCollection.deleteOne(userId,following._id);

        res.status(200).json({
            message: `Your unfollowed ${req.params.username} successfully.`,
        });
    }
);

/**
 * Unfollow a user.
 */
 router.delete(
    '/follower/:username?',
    [
        userValidator.isUserLoggedIn,
        userValidator.isUserParamExists,
        followValidator.isFollowerDoesNotExist,
    ],
    async (req: Request, res: Response) => {
        console.log('inside')
        const userId = (req.session.userId as string) ?? '';
        const following = await UserCollection.findOneByUsername(req.params.username);
        await FollowCollection.deleteOne(following._id,userId);

        res.status(200).json({
            message: `You removed ${req.params.username} from your followers successfully.`,
        });
    }
);

export {router as followRouter};