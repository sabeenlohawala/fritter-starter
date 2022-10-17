import type {Request, Response} from 'express';
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
    ],
    async (req: Request, res: Response) => {
        // const userId = (req.session.userId as string) ?? '';
        // const follow = await FollowCollection.addOne(userId,req.body.username);

        res.status(201).json({
            message: 'Your follow request was successful.',
            // follow: util.constructFollowResponse(follow)
        });
    }
);

export {router as followRouter};