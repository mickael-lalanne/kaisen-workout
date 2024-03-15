import { ESessionState, Session, SessionRep } from '../models/Session';
import { BSON } from 'realm';

/**
 * Retrieves the in-progress session from the given collection.
 * @param collection - The collection of sessions to search in.
 * @returns The in-progress session, if found.
 */
export function getInProgressSession(
    collection: Realm.Results<Session>
): Realm.Results<Session> {
    return collection
        .sorted('date')
        .filtered('state == $0', ESessionState.InProgress);
}

/**
 * Returns a function that filters and sorts a collection of sessions to get the last session for a given program ID.
 * @param programId - The ID of the program.
 * @returns A function that takes a collection of sessions and returns the filtered and sorted collection.
 */
export function getLastSession(
    programId: BSON.ObjectId
): (collection: Realm.Results<Session>) => Realm.Results<Session> {
    return (collection: Realm.Results<Session>) =>
        collection
            .sorted('date', true)
            .filtered('state != $0', ESessionState.InProgress)
            .filtered('programId == $0', programId);
}

/**
 * Retrieves the maximum session repetition based on the given parameters.
 * @param realm - The Realm instance.
 * @param currentRep - The current session repetition.
 * @returns The maximum session repetition or undefined if not found.
 */
export function getMaxSessionRep(
    realm: Realm,
    currentRep: SessionRep | null
): SessionRep | undefined {
    return realm
        .objects(SessionRep)
        .filtered(
            'exerciseId == $0 && _id != $1 && order == $2',
            currentRep?.exerciseId,
            currentRep?._id,
            currentRep?.order
        )
        .sorted('weight', true)
        .at(0);
}
