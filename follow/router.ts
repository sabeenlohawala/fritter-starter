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
 *
 * @param {string} username - The username of the user to follow
 * @return {FollowResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not provided
 * @throws {404} - If username does not exist
 * @throws {409} - If follow relation already exists
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
 *
 * @name DELETE /api/follows/:username
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not provided
 * @throws {404} - If username does not exist
 * @throws {404} - If follow relationship does not exist
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
 * Remove a user from the logged in user's followers.
 *
 * @name DELETE /api/follows/:username
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not provided
 * @throws {404} - If username does not exist
 * @throws {404} - If follow relationship does not exist
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

/**
 * Get all of user's followers.
 *
 * @name GET /api/follows/followers
 *
 * @return {FollowResponse[]} - An array of follows where following = user
 * @throws {403} - If user not logged in
 *
 */
router.get(
    '/followers',
    [
        userValidator.isUserLoggedIn,
    ],
    async (req:Request, res:Response) => {
        const userId = (req.session.userId as string) ?? '';
        const allFollowers = await FollowCollection.findAllFollowersByUserId(userId);
        const response = allFollowers.map(util.constructFollowResponse);
        res.status(200).json(response);
    }
)

/**
 * Get all of the users that the logged in user is following.
 *
 * @name GET /api/follows/following
 *
 * @return {FollowResponse[]} - An array of follows where follower = user
 * @throws {403} - If user not logged in
 *
 */
router.get(
    '/following',
    [
        userValidator.isUserLoggedIn,
    ],
    async (req:Request, res:Response) => {
        const userId = (req.session.userId as string) ?? '';
        const allFollowing = await FollowCollection.findAllFollowingByUserId(userId);
        const response = allFollowing.map(util.constructFollowResponse);
        res.status(200).json(response);
    }
)

export {router as followRouter};