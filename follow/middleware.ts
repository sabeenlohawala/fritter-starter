import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FollowCollection from '../follow/collection'

const doesFollowExist = async (req: Request, res: Response, next: NextFunction) => {
}