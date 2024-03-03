import Realm, { BSON } from 'realm';

// To use a class as a Realm object type in Typescript with the `@realm/babel-plugin` plugin,
// simply define the properties on the class with the correct type and the plugin will convert
// it to a Realm schema automatically.
export class Exercise extends Realm.Object {
    _id: BSON.ObjectId = new BSON.ObjectId();
    name!: string;
    description!: string;
    image!: string; // base64

    static primaryKey = '_id';
}
