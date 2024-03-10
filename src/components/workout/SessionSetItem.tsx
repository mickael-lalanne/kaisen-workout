import { View, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { useQuery } from '@realm/react';
import { Set } from '../../models/Program';
import { useAppTheme } from '../../app/theme';
import { Exercise } from '../../models/Exercise';
import { BSON } from 'realm';
import ExerciseImage from '../shared/ExerciseImage';
import NumberInput from '../shared/NumberInput';
import { useAppSelector } from '../../app/hooks';
import { selectActiveSet } from '../../features/currentSession';

type SessionSetItemProps = {
    set: Set;
    pressHandler: (set: Set) => void;
    longPressHandler: (set: Set) => void;
};

const ORDINAL_NUMBER: string[] = [
    '1st',
    '2nd',
    '3rd',
    '4th',
    '5th',
    '6th',
    '7th',
    '8th',
    '9th',
    '10th',
];

export default function SessionSetItem({
    set,
    pressHandler,
    longPressHandler,
}: SessionSetItemProps) {
    const theme = useAppTheme();
    const activeSet: string | undefined = useAppSelector(selectActiveSet);

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

        for (let i = 0; i < set.repsNumber; i++) {
            reps.push(
                <NumberInput
                    key={i}
                    value={i.toString()}
                    style={styles.repNumber}
                    label={ORDINAL_NUMBER[i] + ' rep'}
                    changeHandler={() => {}}
                    alert
                />
            );
        }

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
    repNumber: {
        width: 79,
    },
});
