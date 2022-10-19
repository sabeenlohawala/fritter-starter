import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CircleCollection from '../circle/collection';
import UserCollection from '../user/collection';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware';
import * as circleValidator from '../circle/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Add a user to a circle.
 *
 * @name POST /api/circles/
 *
 * @param {string} circlename - The name of the circle in which to add the follower
 * @param {string} username - The username of the user to add
 * @return {CircleResponse} - The created circle
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not provided
 * @throws {404} - If username does not exist
 * @throws {404} - If follow relation does not exist
 * @throws {409} - If circle already exists
 */
 router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        userValidator.isUserExists,
        followValidator.isFollowRelationDoesNotExist,
        circleValidator.isCircleAlreadyExists
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const circlename = req.body.circlename;
        const member = await UserCollection.findOneByUsername(req.body.username);
        const circle = await CircleCollection.addOne(circlename,userId,member._id);

        res.status(201).json({
            message: `You added ${req.body.username} to ${circlename} successfully.`,
            follow: util.constructCircleResponse(circle)
        });
    }
);

/**
 * Remove a user from a circle
 *
 * @name DELETE /api/circles/:circlename/:username
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not provided
 * @throws {404} - If username does not exist
 * @throws {404} - If follow relationship does not exist
 */
 router.delete(
    '/:circlename?/:username?',
    [
        userValidator.isUserLoggedIn,
        userValidator.isUserParamExists,
        circleValidator.isCircleDoesNotExist,
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const circlename = req.params.circlename;
        const member = await UserCollection.findOneByUsername(req.params.username);
        await CircleCollection.deleteOne(circlename,userId,member._id);

        res.status(200).json({
            message: `Your removed ${req.params.username} from Circle ${circlename} successfully.`,
        });
    }
);

export {router as circleRouter};