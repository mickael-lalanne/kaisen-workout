import { View, StyleSheet } from 'react-native';
import { List, Text } from 'react-native-paper';
import { useQuery } from '@realm/react';
import { Set } from '../../models/Program';
import { useAppTheme } from '../../app/theme';
import { Exercise } from '../../models/Exercise';
import { BSON } from 'realm';
import ExerciseImage from '../shared/ExerciseImage';

type SessionSetItemProps = {
    set: Set;
};

export default function SessionSetItem({ set }: SessionSetItemProps) {
    const theme = useAppTheme();

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
            style={{ backgroundColor: theme.colors.elevation.level5 }}
        >
            <View>
                <Text>Todo...</Text>
            </View>
        </List.Accordion>
    );
}

const styles = StyleSheet.create({});
