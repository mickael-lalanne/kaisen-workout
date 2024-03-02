import { StatusBar } from 'expo-status-bar';
import { DARK_THEME } from './theme';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RealmProvider } from '@realm/react';
import HomeScreen from './components/screens/HomeScreen';
import WorkoutScreen from './components/screens/WorkoutScreen';
import ProgramScreen from './components/screens/ProgramScreen';
import { Exercise } from './models/Exercise';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <RealmProvider schema={[Exercise]}>
            <NavigationContainer>
                <StatusBar style="dark" />
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: DARK_THEME.primary,
                        },
                        headerTintColor: 'black',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        animation: 'none',
                    }}
                >
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Workout" component={WorkoutScreen} />
                    <Stack.Screen name="Program" component={ProgramScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </RealmProvider>
    );
}
