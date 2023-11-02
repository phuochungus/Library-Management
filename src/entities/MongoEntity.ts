import { ObjectId } from 'mongodb';

export default interface MongoEntity {
  _id: ObjectId;
}
