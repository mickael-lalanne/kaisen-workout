import { View, StyleSheet } from 'react-native';
import MyText from '../shared/MyText';
import { useQuery } from '@realm/react';
import { Exercise } from '../../models/Exercise';

export default function WorkoutScreen() {
    // Find
    const exercises = useQuery(Exercise);
    // Sort
    const sortedExercises: string = useQuery(Exercise, exercises => {
      return exercises.sorted('name', false);
    }).toString();

    return (
        <View style={styles.viewContainer}>
            <MyText text="Workout Screen"></MyText>

            <MyText text="My exercises :"></MyText>
            <MyText text={sortedExercises}></MyText>
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
