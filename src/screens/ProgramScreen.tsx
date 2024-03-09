import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { EScreens } from '../app/router';
import ProgramBuilderScreen from './ProgramBuilderScreen';
import HeaderBar from '../components/HeaderBar';
import ProgramHomeScreen from './ProgramHomeScreen';
import ExerciseScreen from './ExercicesScreen';

export default function ProgramScreen() {
    const Stack = createStackNavigator();

    return (
        <View style={styles.viewContainer}>
            <HeaderBar></HeaderBar>

            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name={EScreens.ProgramHome} component={ProgramHomeScreen} />
                <Stack.Screen name={EScreens.ProgramBuilder} component={ProgramBuilderScreen} />
                <Stack.Screen name={EScreens.Exercises} component={ExerciseScreen} />
            </Stack.Navigator>

        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontStyle: 'italic',
        marginTop: 20,
    },
});
