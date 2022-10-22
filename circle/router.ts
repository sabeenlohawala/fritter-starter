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
        userValidator.isBodyNotEqualLoggedInUser,
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
 * @name DELETE /api/circles/:circlename/members/:username
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not provided
 * @throws {404} - If username does not exist
 * @throws {404} - If circle membership does not exist
 */
 router.delete(
    '/:circlename?/members/:username?',
    [
        userValidator.isUserLoggedIn,
        userValidator.isUserParamExists,
        userValidator.isParamsNotEqualLoggedInUser,
        circleValidator.isCircleMemberDoesNotExist,
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

/**
 * Delete a circle
 *
 * @name DELETE /api/circles/:circlename/
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not provided
 * @throws {404} - If username does not exist
 * @throws {404} - If circle membership does not exist
 */
 router.delete(
    '/:circlename?',
    [
        userValidator.isUserLoggedIn,
        circleValidator.isCircleParamExists
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const circlename = req.params.circlename as string;
        await CircleCollection.deleteManyByOwnerAndName(circlename,userId);

        res.status(200).json({
            message: `Your deleted Circle ${circlename} successfully.`,
        });
    }
);

/**
 * Get all the circles
 *
 * @name GET /api/circles
 *
 * @return {CircleResponse[]} - A list of all the circle memberships
 */
/**
 * Get freets by author.
 *
 * @name GET /api/circles?circlename=circlename
 *
 * @return {CircleResponse[]} - An array of members in the circle with circlename, circlename created by user
 * @throws {400} - If circlename is not given
 * @throws {404} - If no user has given authorId
 *
 */
 router.get(
    '/',
    [
        userValidator.isUserLoggedIn,
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        // Check if circlename query parameter was supplied
        if (req.query.circlename !== undefined) {
            next();
            return;
        }
        const userId = (req.session.userId as string) ?? '';
        const allCircles = await CircleCollection.findAll(userId);
        const response = allCircles.map(util.constructCircleResponse);
        res.status(200).json(response);
    },
    [
      circleValidator.isCircleQueryExists
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const circleMembers = await CircleCollection.findAllByCirclename(req.query.circlename as string, userId);
        const response = circleMembers.map(util.constructCircleResponse);
        res.status(200).json(response);
    }
);

/**
 * Get circles by member.
 *
 * @name GET /api/circles/members?username=username
 *
 * @return {CircleResponse[]} - An array of circles containing member with username created by user
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given authorId
 *
 */
 router.get(
    '/members',
    [
        userValidator.isUserLoggedIn,
        userValidator.isUserQueryExists,
        userValidator.isQueryNotEqualLoggedInUser,
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const circleMembers = await CircleCollection.findAllByMember(userId, req.query.username as string);
        const response = circleMembers.map(util.constructCircleResponse);
        res.status(200).json(response);
    }
);

export {router as circleRouter};