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
import { ESessionState, Session, SessionSet } from '../../models/Session';

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
                <ExerciseImage
                    exercises={setExercices}
                    size={30}
                    border
                    round
                />
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
        paddingVertical: 5,
        paddingLeft: 5,
        paddingRight: 5,
    },
});
