import { View, StyleSheet } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { EScreens, RouterProps } from '../app/router';
import WorkoutHomeScreen from './WorkoutHomeScreen';
import WorkoutSessionScreen from './WorkoutSessionScreen';
import { createStackNavigator } from '@react-navigation/stack';

export default function WorkoutScreen({ navigation }: RouterProps) {
    const Stack = createStackNavigator();

    return (
        <View style={styles.viewContainer}>
            <HeaderBar navigation={navigation}></HeaderBar>

            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen
                    name={EScreens.WorkoutHome}
                    component={WorkoutHomeScreen}
                />
                <Stack.Screen
                    name={EScreens.WorkoutSession}
                    component={WorkoutSessionScreen}
                />
            </Stack.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
});
