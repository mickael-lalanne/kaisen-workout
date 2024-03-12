import { View, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { EScreens, RouterProps } from '../app/router';
import { useAppTheme } from '../app/theme';
import ProgramSelector from '../components/workout/ProgramSelector';
import { useState } from 'react';
import { useQuery, useRealm } from '@realm/react';
import { BSON } from 'realm';
import { Program, Set } from '../models/Program';
import InfoBox from '../components/shared/InfoBox';
import { ESessionSetState, ESessionState, Session, SessionRep, SessionSet } from '../models/Session';

export default function WorkoutHomeScreen({ navigation }: RouterProps) {
    const [programSelectorVisible, setProgramSelectorVisible] =
        useState<boolean>(false);

    const theme = useAppTheme();
    const programs = useQuery(Program);
    const realm = useRealm();

    const onProgramSelected = (program: Program) => {
        realm.write(() => {
            const defaultSessionSets: SessionSet[] = [];
            const defaultSessionReps: SessionRep[] = [];

            // TODO: make a Session Service with a InitSession method
            // First, we create all the reps for each set
            program.sets.forEach((set: Set) => {
                for (let i = 0; i < set.repsNumber; i++) {
                    set.exerciceIds.forEach((exerciceId: string) => {
                        const rep: SessionRep = realm.create(SessionRep, {
                            exerciseId: new BSON.ObjectId(exerciceId),
                            order: i,
                            note: '',
                            weight: 0
                        });
                        defaultSessionReps.push(rep);
                    });
                }
                // Then we create all program sets with their reps
                const sessionSet: SessionSet = realm.create(SessionSet, {
                    setId: set._id,
                    order: set.order,
                    exerciceIds: set.exerciceIds.map(e => new BSON.ObjectId(e)),
                    state: ESessionSetState.NotStarted,
                    recupDuration: set.recupDuration,
                    note: '', // TODO,
                    reps: defaultSessionReps,
                });
                defaultSessionSets.push(sessionSet);
            });
            // Finally, we can create the session
            realm.create(Session, {
                programId: program._id,
                date: new Date(),
                state: ESessionState.InProgress,
                sets: defaultSessionSets,
            });
        });

        navigation.navigate(EScreens.WorkoutSession);
        setProgramSelectorVisible(false);
    };

    const NoProgramMessage = (): React.JSX.Element | undefined => {
        if (programs.length === 0) {
            return (
                <InfoBox
                    style={{ margin: 20 }}
                    text={`It seems you don't have any programs yet.\nGo to Program tab to create one !`}
                />
            );
        }
    };

    return (
        <View
            style={{
                ...styles.viewContainer,
                backgroundColor: theme.colors.surface,
            }}
        >
            {/* TODO : add title */}

            <View style={{ height: 180 }}>
                {NoProgramMessage()}
            </View>

            <Button
                style={styles.workoutBtn}
                contentStyle={{ height: 100 }}
                mode="contained"
                onPress={() => setProgramSelectorVisible(true)}
                disabled={programs.length === 0}
            >
                START WORKOUT
            </Button>

            <ProgramSelector
                programs={programs}
                selectHandler={onProgramSelected}
                visible={programSelectorVisible}
                hideHandler={() => setProgramSelectorVisible(false)}
            />

            <View style={styles.bottomImageContainer}>
                <Image
                    source={require('../assets/toji.png')}
                    style={styles.toji}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    bottomImageContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    toji: {
        marginRight: 100,
        height: 280,
    },
    workoutBtn: {
        borderRadius: 5,
        marginVertical: 20,
        marginHorizontal: 50,
    },
    noProgramText: {
        fontSize: 12,
        fontStyle: 'italic',
        margin: 20,
    },
});
