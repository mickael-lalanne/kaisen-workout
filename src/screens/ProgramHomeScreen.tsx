import { View, StyleSheet, Image } from 'react-native';
import { Button, Icon, IconButton, Text } from 'react-native-paper';
import { EScreens, RouterProps } from '../app/router';
import React, { useState } from 'react';
import { useQuery } from '@realm/react';
import { Program } from '../models/Program';
import ProgramViewer from '../components/program/ProgramViewer';
import { useAppTheme } from '../app/theme';

export default function ProgramHome({ navigation }: RouterProps) {
    const programs = useQuery(Program);
    const theme = useAppTheme();

    return (
        <View style={styles.viewContainer}>
            {/* PROGRAMS */}

            <Text style={styles.title}>My programs</Text>

            <ProgramViewer programs={programs} navigation={navigation} />

            <Button
                icon="plus-circle-outline"
                mode="outlined"
                style={styles.addButton}
                contentStyle={{ height: 60 }}
                onPress={() => navigation.navigate(EScreens.ProgramBuilder)}
            >
                CREATE A NEW PROGRAM
            </Button>

            <View style={{ flexGrow: 1 }}></View>

            <View style={{...styles.exercisesTooltip, backgroundColor: theme.colors.surfaceVariant}}>
                <Text style={{opacity: 0.7}}>Exercises</Text>
                <View style={styles.exercisesIconContainer}>
                    <Icon source="triangle" size={20} color={theme.colors.surfaceVariant}></Icon>
                </View>
            </View>
            <IconButton
                icon="weight"
                mode="outlined"
                size={25}
                style={styles.exercisesBtn}
                onPress={() => navigation.navigate(EScreens.Exercises)}
            />

            <Image source={require('../assets/gojo.png')} style={styles.gojo} resizeMode='contain' />
        </View>
    );
}

const EXERCICES_BTN_SIZE: number = 70;

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
        marginTop: 20,
        borderRadius: 5,
    },
    gojo: {
        position: 'absolute',
        bottom: 0,
        left: -5,
        width: 150,
        height: 250,
    },
    exercisesTooltip: {
        alignSelf: 'flex-end',
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginRight: 22,
        marginBottom: 10,
    },
    exercisesIconContainer: {
        position: 'absolute',
        right: 10,
        bottom: -10,
        transform: [{ scaleY: -1 }],
    },
    exercisesBtn: {
        height: EXERCICES_BTN_SIZE,
        width: EXERCICES_BTN_SIZE,
        borderRadius: EXERCICES_BTN_SIZE / 2,
        alignSelf: 'flex-end',
    }
});
