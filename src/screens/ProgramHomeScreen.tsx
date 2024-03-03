import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { EScreens, RouterProps } from '../app/router';
import ExerciseBuilder from '../components/ExerciseBuilder';
import { useState } from 'react';

export default function ProgramHome({ navigation }: RouterProps) {
    const [exerciseBuilderVisible, setExerciseBuilderVisible] =
        useState<boolean>(false);

    return (
        <View style={styles.viewContainer}>
            <Text style={styles.title}>My programs</Text>
            <Button
                icon="plus-circle-outline"
                mode="outlined"
                style={styles.addButton}
                onPress={() => navigation.navigate(EScreens.ProgramBuilder)}
            >
                New Program
            </Button>
            <Text style={{ ...styles.title, marginTop: 30 }}>My exercises</Text>
            <Button
                icon="plus-circle-outline"
                mode="outlined"
                style={styles.addButton}
                onPress={() => setExerciseBuilderVisible(true)}
            >
                Add Exercise
            </Button>

            {/* EXERCISE BUILDER */}
            <ExerciseBuilder
                visible={exerciseBuilderVisible}
                hideBuilder={() => setExerciseBuilderVisible(false)}
            ></ExerciseBuilder>
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        padding: 20,
        // alignItems: 'center',
    },
    title: {
        paddingLeft: 30,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addButton: {
        width: 170,
        marginVertical: 10,
    },
});
