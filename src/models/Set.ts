import Realm, { BSON } from 'realm';

export class Set extends Realm.Object {
    _id: BSON.ObjectId = new BSON.ObjectId();
    name!: string;
    recupDuration!: number;
    repsNumber!: number;
    exerciceIds!: BSON.ObjectId[];

    static primaryKey = '_id';
}
