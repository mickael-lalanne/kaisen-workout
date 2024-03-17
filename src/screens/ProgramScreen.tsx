import { View, StyleSheet } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { EScreens, RouterProps } from '../app/router';
import ProgramBuilderScreen from './ProgramBuilderScreen';
import ProgramHomeScreen from './ProgramHomeScreen';
import ExerciseScreen from './ExercicesScreen';

export default function ProgramScreen({ navigation }: RouterProps) {
    const Stack = createStackNavigator();

    return (
        <View style={styles.viewContainer}>
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
