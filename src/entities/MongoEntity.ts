import { ObjectID } from 'typeorm';

export default interface MongoEntity {
  _id: ObjectID;
}
