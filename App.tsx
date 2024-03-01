import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { DARK_THEME } from './theme';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/screens/HomeScreen';
import WorkoutScreen from './components/screens/WorkoutScreen';
import ProgramScreen from './components/screens/ProgramScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
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
                    animation: 'none'
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Workout" component={WorkoutScreen} />
                <Stack.Screen name="Program" component={ProgramScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DARK_THEME.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
