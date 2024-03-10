import { View, StyleSheet } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { EScreens, RouterProps } from '../app/router';
import WorkoutHomeScreen from './WorkoutHomeScreen';
import WorkoutSessionScreen from './WorkoutSessionScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect } from 'react';
import { ESessionState, Session } from '../models/Session';
import { useQuery } from '@realm/react';

export default function WorkoutScreen({ navigation }: RouterProps) {
    const Stack = createStackNavigator();

    const session: Session | undefined = useQuery(Session, (collection) =>
        collection.sorted('date').filtered('state == $0', ESessionState.InProgress) 
    ).at(0);

    useEffect(() => {
        
    }, []);

    return (
        <View style={styles.viewContainer}>
            <HeaderBar navigation={navigation}></HeaderBar>

            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={session ? EScreens.WorkoutSession : EScreens.WorkoutHome}>
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
