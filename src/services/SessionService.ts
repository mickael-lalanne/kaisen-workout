import { Program, Set } from '../models/Program';
import {
    ESessionSetState,
    ESessionState,
    Session,
    SessionRep,
    SessionSet,
} from '../models/Session';
import { BSON } from 'realm';

/**
 * Retrieves the in-progress sessions from the given collection.
 * @param collection - The collection of sessions to search in.
 * @returns The in-progress sessions, if found.
 */
export function getInProgressSessions(
    collection: Realm.Results<Session>
): Realm.Results<Session> {
    return collection
        .sorted('date')
        .filtered('state == $0', ESessionState.InProgress);
}

/**
 * Retrieves the finished sessions from the given collection.
 * @param collection - The collection of sessions to search in.
 * @returns The finished sessions, if found.
 */
export function getFinishedSessions(
    collection: Realm.Results<Session>
): Realm.Results<Session> {
    return collection
        .sorted('date', true)
        .filtered('state == $0', ESessionState.Done);
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

/**
 * Initializes a new session in the specified realm with the given program.
 * @param realm - The realm instance to create the session in.
 * @param program - The program to create the session for.
 */
export function initSession(realm: Realm, program: Program): Session {
    let createdSession: Session | undefined = undefined;
    realm.write(() => {
        program.lastUsageDate = new Date();

        const defaultSessionSets: SessionSet[] = [];

        // First, we create all the reps for each set
        program.sets.forEach((set: Set) => {
            const defaultSessionReps: SessionRep[] = [];
            for (let i = 0; i < set.repsNumber; i++) {
                set.exerciceIds.forEach((exerciceId: string) => {
                    const rep: SessionRep = realm.create(SessionRep, {
                        exerciseId: new BSON.ObjectId(exerciceId),
                        order: i,
                        note: '',
                        weight: 0,
                        number: 0,
                    });
                    defaultSessionReps.push(rep);
                });
            }
            // Then we create all program sets with their reps
            const sessionSet: SessionSet = realm.create(SessionSet, {
                setId: set._id,
                order: set.order,
                exerciceIds: set.exerciceIds.map((e) => new BSON.ObjectId(e)),
                state: ESessionSetState.NotStarted,
                recupDuration: set.recupDuration,
                note: '', // TODO,
                reps: defaultSessionReps,
            });
            defaultSessionSets.push(sessionSet);
        });
        // Finally, we can create the session
        createdSession = realm.create(Session, {
            programId: program._id,
            date: new Date(),
            state: ESessionState.InProgress,
            sets: defaultSessionSets,
        });
    });

    return createdSession!;
}
