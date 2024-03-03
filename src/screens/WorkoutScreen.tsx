import { View, StyleSheet, Image } from 'react-native';
import { useQuery } from '@realm/react';
import { Exercise } from '../models/Exercise';
import { Text } from 'react-native-paper';
import HeaderBar from '../components/HeaderBar';

export default function WorkoutScreen() {
    // Find
    const exercises = useQuery(Exercise);
    // Sort
    const sortedExercises: string = useQuery(Exercise, (exercises) => {
        return exercises.sorted('name', false);
    }).toString();

    return (
        <View style={styles.viewContainer}>
            <HeaderBar></HeaderBar>
            <Text>Workout Screen</Text>

            <Text>My exercises :</Text>
            <Text>{sortedExercises}</Text>
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
        marginRight: 70,
        height: 230,
    },
});
