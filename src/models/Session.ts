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

    sets?: SessionSet[];

    static primaryKey = '_id';
}

export enum ESessionSetState {
    Todo = 'Todo',
    InProgress = 'InProgress',
    Done = 'Done',
    Canceled = 'Canceled',
};

export class SessionSet extends Realm.Object {
    _id: BSON.ObjectId = new BSON.ObjectId();
    setId!: BSON.ObjectId;
    note!: string;
    recupDuration!: number;
    order!: number;
    state!: string; // ESessionSetState

    reps!: SessionRep[];
}

export class SessionRep extends Realm.Object {
    _id: BSON.ObjectId = new BSON.ObjectId();
    exerciceId!: BSON.ObjectId;
    note!: string;
    order!: number;
    weight!: number;
}
