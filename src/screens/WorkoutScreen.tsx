import { View, StyleSheet } from 'react-native';
import { useQuery } from '@realm/react';
import { Exercise } from '../models/Exercise';
import { Text } from 'react-native-paper';

export default function WorkoutScreen() {
    // Find
    const exercises = useQuery(Exercise);
    // Sort
    const sortedExercises: string = useQuery(Exercise, exercises => {
      return exercises.sorted('name', false);
    }).toString();

    return (
        <View style={styles.viewContainer}>
            <Text>Workout Screen</Text>

            <Text>My exercises :</Text>
            <Text>{sortedExercises}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
