import Realm, { BSON } from 'realm';

export class Program extends Realm.Object {
    _id: BSON.ObjectId = new BSON.ObjectId();
    name!: string;
    description!: string;
    image!: string;
    sets!: Realm.List<Set>;
    creationDate: Date = new Date();
    lastUsageDate?: Date;

    static primaryKey = '_id';
}
export class Set extends Realm.Object  {
    _id: BSON.ObjectId = new BSON.ObjectId();
    notes!: string;
    recupDuration!: number;
    repsNumber!: number;
    order!: number;
    exerciceIds!: Realm.List<string>;

    static primaryKey = '_id';
}

export interface ISet {
    _id: BSON.ObjectId;
    notes: string;
    recupDuration: number;
    repsNumber: number;
    order: number;
    exerciceIds: string[];
}
