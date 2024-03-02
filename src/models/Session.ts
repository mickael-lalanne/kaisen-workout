import Realm, { BSON } from 'realm';

export class Session extends Realm.Object {
    _id: BSON.ObjectId = new BSON.ObjectId();
    programId!: BSON.ObjectId;
    date!: Date;
    note!: string;

    sets!: SessionSet[];

    static primaryKey = '_id';
}

export class SessionSet extends Realm.Object {
    _id: BSON.ObjectId = new BSON.ObjectId();
    setId!: BSON.ObjectId;
    note!: string;
    recupDuration!: number;
    order!: number;

    reps!: SessionRep[];
}

export class SessionRep extends Realm.Object {
    _id: BSON.ObjectId = new BSON.ObjectId();
    exerciceId!: BSON.ObjectId;
    note!: string;
    order!: number;
    weight!: number;
}
