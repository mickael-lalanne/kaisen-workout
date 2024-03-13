import { StatusBar } from 'expo-status-bar';
import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme as DefaultDarkTheme,
} from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { Icon, PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import ProgressionScreen from './screens/ProgressionScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import ProgramScreen from './screens/ProgramScreen';
import { DARK_THEME, LIGHT_THEME } from './app/theme';
import { EScreens } from './app/router';
import { useQuery, useRealm } from '@realm/react';
import { EWeightUnit, Preferences } from './models/Preferences';

const Tab = createMaterialBottomTabNavigator();
const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: DefaultTheme,
    reactNavigationDark: DefaultDarkTheme,
});

// An AppChild component is needed to access the preferences stored in redux
export default function AppChild() {
    const realm = useRealm()
    const preferences: Preferences | undefined = useQuery(Preferences, preferences => preferences).at(0);

    // Init preferences if not set yet
    if (preferences === undefined) {
        realm.write(() => {
            realm.create(Preferences, {
                darkMode: true,
                weightUnit: EWeightUnit.KG,
                userId: '',
            });
        });
    }

    const darkMode: boolean = !preferences || preferences.darkMode ? true : false;

    return (
        <PaperProvider theme={darkMode ? DARK_THEME : LIGHT_THEME}>
            <NavigationContainer theme={darkMode ? DarkTheme : LightTheme}>
                <StatusBar style={darkMode ? 'light' : 'dark'} />
                <Tab.Navigator initialRouteName={EScreens.Workout}>
                    <Tab.Screen
                        name={EScreens.Program}
                        component={ProgramScreen}
                        options={{
                            tabBarIcon: ({ color }) => (
                                <Icon source="file-document-edit-outline" color={color} size={26} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name={EScreens.Workout}
                        component={WorkoutScreen}
                        options={{
                            tabBarIcon: ({ color }) => (
                                <Icon source="weight-lifter" color={color} size={26} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name={EScreens.Progression}
                        component={ProgressionScreen}
                        options={{
                            tabBarIcon: ({ color }) => (
                                <Icon source="chart-bell-curve-cumulative" color={color} size={26} />
                            ),
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}
