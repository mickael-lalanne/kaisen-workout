import Realm, { BSON } from 'realm';

export class Preferences extends Realm.Object {
    _id: BSON.ObjectId = new BSON.ObjectId();
    darkMode!: boolean;
    theme!: string; // EThemeColor
    weightUnit!: string; // EWeightUnit
    userId!: string; // Not used atm, but set it in case we need online sync later

    static primaryKey = '_id';
}

export enum EWeightUnit {
    KG = 'kg',
    LB = 'lb',
}

export enum EThemeColor {
    Blue = 'blue',
    Orange = 'orange',
}
