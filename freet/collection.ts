import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from './model';
import FreetModel from './model';
import UserCollection from '../user/collection';
import CircleCollection from '../circle/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FreetCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, content: string, circlename?:string | undefined): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    const freet = new FreetModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date,
      circlename: circlename,
    });
    await freet.save(); // Saves freet to MongoDB
    return freet.populate('authorId');
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({_id: freetId}).populate('authorId');
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    return FreetModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
   static async findAllAccessible(userId?: Types.ObjectId | string | undefined): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    const allFreets = await FreetCollection.findAll();
    const allAccessible = [];
    for (const freet of allFreets){
      if (freet.circlename){
        if (userId){
          const circle = await CircleCollection.findOneMembership(freet.circlename,freet.authorId,userId);
          if (circle){
            allAccessible.push(freet);
          }
        }
      }
      else{
        allAccessible.push(freet);
      }
    }
    return allAccessible;
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    return FreetModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
   static async findAllAccessibleByUsername(username: string,userId?: Types.ObjectId | string | undefined): Promise<Array<HydratedDocument<Freet>>> {
    const allFreets = await FreetCollection.findAllByUsername(username);
    const author = await UserCollection.findOneByUsername(username);

    const allAccessible = [];
    for (const freet of allFreets){
      if (freet.circlename){
        if (userId){
          const circle = await CircleCollection.findOneMembership(freet.circlename,freet.authorId,userId);
          if (circle || author.username === username){
            allAccessible.push(freet);
          }
        }
      }
      else{
        allAccessible.push(freet);
      }
    }
    return allAccessible;
  }

  /**
   * Update a freet with the new content
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(freetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    freet.content = content;
    freet.dateModified = new Date();
    await freet.save();
    return freet.populate('authorId');
  }

  /**
   * Update a freet with the new circlename
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} circlename - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
   static async updateOneCirclename(freetId: Types.ObjectId | string, circlename: string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    freet.circlename = circlename;
    await freet.save();
    return freet.populate('authorId');
  }

  /**
   * Update a freet with the new circlename
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} circlename - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
   static async updateOneRemoveCirclename(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    freet.circlename = undefined;
    await freet.save();
    return freet.populate('authorId');
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await FreetModel.deleteOne({_id: freetId});
    return freet !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FreetModel.deleteMany({authorId});
  }
}

export default FreetCollection;
