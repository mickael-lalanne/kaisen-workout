import Realm, { BSON } from 'realm';

export class Program extends Realm.Object {
    _id: BSON.ObjectId = new BSON.ObjectId();
    name!: string;
    description!: string;
    image!: ArrayBuffer;
    sets!: Set[];

    static primaryKey = '_id';
}

export class Set extends Realm.Object {
    _id: BSON.ObjectId = new BSON.ObjectId();
    name!: string;
    recupDuration!: number;
    repsNumber!: number;
    exerciceIds!: BSON.ObjectId[];
}
