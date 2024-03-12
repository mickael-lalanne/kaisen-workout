import Realm, { BSON } from 'realm';

export enum ESessionState {
    InProgress = 'InProgress',
    Done = 'Done',
    Canceled = 'Canceled',
}

export class Session extends Realm.Object {
    _id: BSON.ObjectId = new BSON.ObjectId();
    programId!: BSON.ObjectId;
    date!: Date;
    note?: string;
    state!: string; // ESessionState

    sets!: Realm.List<SessionSet>;

    static primaryKey = '_id';
}

export enum ESessionSetState {
    NotStarted = 'NotStarted',
    InProgress = 'InProgress',
    Done = 'Done',
};

export class SessionSet extends Realm.Object {
    _id: BSON.ObjectId = new BSON.ObjectId();
    setId!: BSON.ObjectId;
    exerciceIds!: Realm.List<BSON.ObjectId>;
    note!: string;
    recupDuration!: number;
    order!: number;
    state!: string; // ESessionSetState

    reps!: Realm.List<SessionRep>;

    static primaryKey = '_id';
}

export class SessionRep extends Realm.Object {
    _id: BSON.ObjectId = new BSON.ObjectId();
    note!: string;
    exerciseId!: BSON.ObjectId;
    order!: number;
    weight!: number;

    static primaryKey = '_id';
}
