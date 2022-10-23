import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import FeedCollection from '../feed/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from '../freet/util';

const router = express.Router();

/**
 * Get all the freets in the logged in user's feed.
 *
 * @name GET /api/feeds
 *
 * @return {FreetResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
    '/',
    [
        userValidator.isUserLoggedIn,
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const userFeed = await FeedCollection.findAll(userId);
        const response = userFeed.map(util.constructFreetResponse);
        res.status(200).json(response);
    }
);

export {router as feedRouter};