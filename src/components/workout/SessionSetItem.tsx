import { View, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { useQuery, useRealm } from '@realm/react';
import { useAppTheme } from '../../app/theme';
import { Exercise } from '../../models/Exercise';
import { BSON } from 'realm';
import ExerciseImage from '../shared/ExerciseImage';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectActiveSet, setActiveSet } from '../../features/currentSession';
import SessionRep from './SessionRep';
import { ESessionSetState, SessionSet } from '../../models/Session';
import { useEffect, useState } from 'react';
import ConfirmDialog from '../shared/ConfirmDialog';

type SessionSetItemProps = { sessionSet: SessionSet };

export default function SessionSetItem({ sessionSet }: SessionSetItemProps) {
    const [state, setState] = useState<ESessionSetState>(
        ESessionSetState.NotStarted
    );
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const theme = useAppTheme();
    const activeSet: string | undefined = useAppSelector(selectActiveSet);
    const realm = useRealm();
    const dispatch = useAppDispatch();

    /**
     * Updates the state based on the session set's reps.
     */
    useEffect(() => {
        if (sessionSet?.reps.every((set) => set.weight)) {
            setState(ESessionSetState.Done);
        } else if (sessionSet?.reps.some((set) => set.weight)) {
            setState(ESessionSetState.InProgress);
        } else {
            setState(ESessionSetState.NotStarted);
        }
    }, [sessionSet]);

    const exerciceIds: BSON.ObjectId[] = sessionSet.exerciceIds.map(
        (e) => new BSON.ObjectId(e)
    );
    const setExercices: Realm.Results<Exercise> = useQuery(
        Exercise,
        (collection) => collection.filtered('_id IN $0', exerciceIds)
    );

    const deleteSet = () => {
        realm.write(() => {
            realm.delete(sessionSet);
        });
        setConfirmDelete(false);
    };

    const _getExerciceName = (): string => {
        const exercisesNames: string[] = setExercices.map((ex) => ex.name);

        return exercisesNames.join(' / ');
    };

    const _getStateColor = (): string | undefined => {
        switch (state) {
            case ESessionSetState.InProgress:
                return theme.colors.inProgress;
            case ESessionSetState.Done:
                return theme.colors.success;
            case ESessionSetState.NotStarted:
            default:
                return undefined;
        }
    };

    const SetReps = (): React.JSX.Element[] => {
        const reps: React.JSX.Element[] = [];
        sessionSet?.reps.forEach((rep) => {
            reps.push(
                <SessionRep
                    key={rep._id.toString()}
                    sessionSetId={sessionSet._id}
                    repId={rep._id}
                />
            );
        });
        return reps;
    };

    return (
        <List.Accordion
            title={_getExerciceName()}
            left={(props) => (
                <View>
                    <View
                        style={{
                            ...styles.stateIndicator,
                            backgroundColor: _getStateColor(),
                        }}
                    ></View>
                    <ExerciseImage
                        exercises={setExercices}
                        size={30}
                        border
                        round
                    />
                </View>
            )}
            style={{
                backgroundColor: theme.colors.elevation.level5,
                paddingLeft: 10,
                borderTopColor: theme.colors.elevation.level2,
                borderTopWidth: 1,
            }}
            expanded={activeSet === sessionSet._id.toString()}
            onPress={() => {
                dispatch(setActiveSet(sessionSet._id.toString()));
            }}
            onLongPress={() => setConfirmDelete(true)}
        >
            <View style={styles.setContainer}>{SetReps()}</View>

            <ConfirmDialog
                visible={confirmDelete}
                title="It stays between us 🙈"
                content={
                    'Do you want to skip the ' +
                    _getExerciceName() +
                    ' set for today ?'
                }
                confirmHandler={deleteSet}
                cancelHandler={() => setConfirmDelete(false)}
            />
        </List.Accordion>
    );
}

const styles = StyleSheet.create({
    setContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
        columnGap: 10,
        paddingVertical: 5,
        paddingLeft: 15,
        paddingRight: 5,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    stateIndicator: {
        position: 'absolute',
        top: -50,
        left: -10,
        width: 5,
        height: 200,
    },
});
