import Realm, { BSON } from 'realm';
import { Set } from './Set';

export class Program extends Realm.Object {
    _id: BSON.ObjectId = new BSON.ObjectId();
    name!: string;
    description!: string;
    image!: ArrayBuffer;
    sets!: Set[];

    static primaryKey = '_id';
}
