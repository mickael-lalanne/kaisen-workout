import { View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useObject, useRealm } from '@realm/react';
import { BSON } from 'realm';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentSessionId } from '../../features/currentSession';
import {
    ESessionSetState,
    Session,
    SessionRep,
    SessionSet,
} from '../../models/Session';
import React, { useState } from 'react';
import SetBuilder from '../program/SetBuilder';
import { ISet } from '../../models/Program';

export default function AddSessionSetButton() {
    const [showSetBuilder, setShowSetBuilder] = useState<boolean>(false);

    const realm = useRealm();
    const currentSessionId: string | undefined = useAppSelector(
        selectCurrentSessionId
    );

    const session: Session | null = useObject(
        Session,
        new BSON.ObjectId(currentSessionId)
    );

    const addSetToSession = (set: ISet) => {
        if (session && set) {
            realm.write(() => {
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

                session.sets.push(
                    realm.create(SessionSet, {
                        _id: new BSON.ObjectId(),
                        setId: set._id,
                        exerciceIds: set.exerciceIds.map(
                            (id) => new BSON.ObjectId(id)
                        ) as unknown as Realm.List<BSON.ObjectId>,
                        order: set.order,
                        // Todo: stop using state of sets as it can be derived from reps
                        state: ESessionSetState.NotStarted,
                        onTheFly: true,
                        note: set.notes,
                        recupDuration: set.recupDuration,
                        reps: defaultSessionReps as unknown as Realm.List<SessionRep>,
                    })
                );
            });
        }
    };

    const Builder = (): React.JSX.Element | undefined => {
        if (session) {
            return (
                <SetBuilder
                    visible={showSetBuilder}
                    setsNumber={session.sets.length}
                    saveHandler={addSetToSession}
                    hideBuilder={() => setShowSetBuilder(false)}
                />
            );
        }
    };

    return (
        <View>
            <IconButton
                icon="plus"
                mode="contained"
                style={styles.button}
                onPress={() => setShowSetBuilder(true)}
            />

            {Builder()}
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
});
