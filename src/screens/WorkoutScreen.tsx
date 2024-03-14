import { View, StyleSheet } from 'react-native';
import { EScreens, RouterProps } from '../app/router';
import WorkoutHomeScreen from './WorkoutHomeScreen';
import WorkoutSessionScreen from './WorkoutSessionScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect } from 'react';
import { ESessionState, Session } from '../models/Session';
import { useQuery } from '@realm/react';
import { getFocusedRouteNameFromRoute, useRoute } from '@react-navigation/native';

export default function WorkoutScreen({ navigation }: RouterProps) {
    const Stack = createStackNavigator();

    const session: Session | undefined = useQuery(Session, (collection) =>
        collection.sorted('date').filtered('state == $0', ESessionState.InProgress) 
    ).at(0);
    const route = useRoute();

    useEffect(() => {
        if (session && getFocusedRouteNameFromRoute(route) !== EScreens.WorkoutSession) {
            navigation.navigate(EScreens.WorkoutSession);
        }
    }, [session]);

    return (
        <View style={styles.viewContainer}>
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
