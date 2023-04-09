import {ObjectID} from "mongodb";

export default interface MongoEntity {
  _id: ObjectID;
}
