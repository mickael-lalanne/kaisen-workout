import { View, StyleSheet, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { EScreens, RouterProps } from '../app/router';
import ExerciseBuilder from '../components/program/ExerciseBuilder';
import React, { useState } from 'react';
import ExerciseViewer from '../components/program/ExerciseViewer';
import { useQuery } from '@realm/react';
import { Program } from '../models/Program';
import ProgramViewer from '../components/program/ProgramViewer';

export default function ProgramHome({ navigation }: RouterProps) {
    const [exerciseBuilderVisible, setExerciseBuilderVisible] =
        useState<boolean>(false);

    const programs = useQuery(Program);

    return (
        <View style={styles.viewContainer}>
            {/* PROGRAMS */}

            <Text style={styles.title}>My programs</Text>

            <ProgramViewer programs={programs} />

            <Button
                icon="plus-circle-outline"
                mode="outlined"
                style={styles.addButton}
                contentStyle={{ height: 60 }}
                onPress={() => navigation.navigate(EScreens.ProgramBuilder)}
            >
                CREATE A NEW PROGRAM
            </Button>

            {/* EXERCISES */}

            {/* <Text style={{ ...styles.title, marginTop: 30 }}>My exercises</Text>
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

            <ExerciseViewer /> */}

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
        marginBottom: 20,
    },
    addButton: {
        marginTop: 20,
    },
    gojo: {
        position: 'absolute',
        bottom: 0,
        left: -5,
        width: 150,
        height: 250,
    },
});
