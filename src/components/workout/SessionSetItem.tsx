import { View, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { useQuery } from '@realm/react';
import { Set } from '../../models/Program';
import { useAppTheme } from '../../app/theme';
import { Exercise } from '../../models/Exercise';
import { BSON } from 'realm';
import ExerciseImage from '../shared/ExerciseImage';
import { useAppSelector } from '../../app/hooks';
import { selectActiveSet } from '../../features/currentSession';
import SessionRep from './SessionRep';
import { ESessionSetState, ESessionState, Session, SessionSet } from '../../models/Session';
import { useEffect, useState } from 'react';

type SessionSetItemProps = {
    set: Set;
    pressHandler: (set: Set) => void;
    longPressHandler: (set: Set) => void;
};

export default function SessionSetItem({
    set,
    pressHandler,
    longPressHandler,
}: SessionSetItemProps) {
    const [state, setState] = useState<ESessionSetState>(ESessionSetState.NotStarted);

    const theme = useAppTheme();
    const activeSet: string | undefined = useAppSelector(selectActiveSet);

    // TODO : duplicate code
    const sessionSet: SessionSet | undefined = useQuery(Session, (collection) =>
        collection
            .sorted('date')
            .filtered('state == $0', ESessionState.InProgress)
    )
        .at(0)
        ?.sets.filtered('setId == $0', set._id)
        .at(0);

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

    const exerciceIds: BSON.ObjectId[] = set.exerciceIds.map(
        (e) => new BSON.ObjectId(e)
    );
    const setExercices: Realm.Results<Exercise> = useQuery(
        Exercise,
        (collection) => collection.filtered('_id IN $0', exerciceIds)
    );

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
                    <View style={{...styles.stateIndicator, backgroundColor: _getStateColor()}}></View>
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
            expanded={activeSet === set._id.toString()}
            onPress={() => pressHandler(set)}
            onLongPress={() => longPressHandler(set)}
        >
            <View style={styles.setContainer}>{SetReps()}</View>
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
    }
});
