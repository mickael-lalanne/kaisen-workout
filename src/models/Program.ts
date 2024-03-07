import Realm, { BSON } from 'realm';

export class Program extends Realm.Object {
    _id: BSON.ObjectId = new BSON.ObjectId();
    name!: string;
    description!: string;
    image!: ArrayBuffer;
    sets!: Set[];

    static primaryKey = '_id';
}

export interface Set {
    _id: BSON.ObjectId;
    notes: string;
    recupDuration: number;
    repsNumber: number;
    order: number;
    exerciceIds: BSON.ObjectId[];
}
