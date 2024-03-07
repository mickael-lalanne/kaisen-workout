import { View, StyleSheet, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { EScreens, RouterProps } from '../app/router';
import ExerciseBuilder from '../components/ExerciseBuilder';
import React, { useState } from 'react';
import ExerciseViewer from '../components/ExerciseViewer';

export default function ProgramHome({ navigation }: RouterProps) {
    const [exerciseBuilderVisible, setExerciseBuilderVisible] =
        useState<boolean>(false);

    return (
        <View style={styles.viewContainer}>
            {/* PROGRAMS */}

            <Text style={styles.title}>My programs</Text>
            <Button
                icon="plus-circle-outline"
                mode="outlined"
                style={styles.addButton}
                onPress={() => navigation.navigate(EScreens.ProgramBuilder)}
            >
                New Program
            </Button>

            {/* EXERCISES */}

            <Text style={{ ...styles.title, marginTop: 30 }}>My exercises</Text>
            <Button
                icon="plus-circle-outline"
                mode="outlined"
                style={styles.addButton}
                onPress={() => setExerciseBuilderVisible(true)}
            >
                Add Exercise
            </Button>

            <ExerciseBuilder
                visible={exerciseBuilderVisible}
                hideBuilder={() => setExerciseBuilderVisible(false)}
            ></ExerciseBuilder>

            <ExerciseViewer />

            <Image source={require('../assets/gojo.png')} style={styles.gojo} resizeMode='contain' />
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        padding: 20,
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
    gojo: {
        position: 'absolute',
        bottom: 0,
        left: -5,
        width: 150,
        height: 250,
    },
});
