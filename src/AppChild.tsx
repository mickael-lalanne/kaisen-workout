import { StatusBar } from 'expo-status-bar';
import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme as DefaultDarkTheme,
    EventArg,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    IconButton,
    PaperProvider,
    adaptNavigationTheme,
} from 'react-native-paper';
import ProgressionScreen from './screens/ProgressionScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import ProgramScreen from './screens/ProgramScreen';
import { DARK_THEME, LIGHT_THEME, useAppTheme } from './app/theme';
import { EScreens } from './app/router';
import { useQuery, useRealm } from '@realm/react';
import { EWeightUnit, Preferences } from './models/Preferences';
import HeaderBar from './components/HeaderBar';
import { StyleSheet } from 'react-native';
import { useAppSelector } from './app/hooks';
import { selectCurrentSessionId } from './features/currentSession';
import * as Haptics from 'expo-haptics';

const Tab = createBottomTabNavigator();
const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: DefaultTheme,
    reactNavigationDark: DefaultDarkTheme,
});

// An AppChild component is needed to access the preferences stored in redux
export default function AppChild() {
    const realm = useRealm();
    const preferences: Preferences | undefined = useQuery(
        Preferences,
        (preferences) => preferences
    ).at(0);

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

    const darkMode: boolean =
        !preferences || preferences.darkMode ? true : false;
    const currentSessionId: string | undefined = useAppSelector(
        selectCurrentSessionId
    );

    const onTabPress = (e: EventArg<'tabPress', true, undefined>) => {
        if (currentSessionId) {
            e.preventDefault();
            return;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <PaperProvider theme={darkMode ? DARK_THEME : LIGHT_THEME}>
            <NavigationContainer theme={darkMode ? DarkTheme : LightTheme}>
                <StatusBar style={darkMode ? 'light' : 'dark'} />
                <Tab.Navigator
                    backBehavior="history"
                    initialRouteName={EScreens.Workout}
                    screenOptions={{
                        tabBarIconStyle: {
                            maxHeight: 30,
                        },
                        tabBarItemStyle: {},
                        tabBarStyle: {
                            ...styles.tabBarItem,
                            backgroundColor: darkMode
                                ? DARK_THEME.colors.surface
                                : LIGHT_THEME.colors.surface,
                        },
                        header: (props) => (
                            <HeaderBar
                                navigation={props.navigation as any}
                            ></HeaderBar>
                        ),
                    }}
                >
                    <Tab.Screen
                        name={EScreens.Program}
                        component={ProgramScreen}
                        listeners={{ tabPress: onTabPress }}
                        options={{
                            tabBarItemStyle: {
                                opacity: currentSessionId ? 0.2 : 1,
                                justifyContent: 'center',
                            },
                            tabBarIcon: ({ color }) => (
                                <IconButton
                                    icon="file-document-edit-outline"
                                    iconColor={color}
                                    size={26}
                                />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name={EScreens.Workout}
                        component={WorkoutScreen}
                        listeners={{ tabPress: onTabPress }}
                        options={{
                            tabBarItemStyle: {
                                justifyContent: 'center',
                            },
                            tabBarIcon: ({ color }) => (
                                <IconButton
                                    icon="weight-lifter"
                                    iconColor={color}
                                    size={26}
                                />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name={EScreens.Progression}
                        component={ProgressionScreen}
                        listeners={{ tabPress: onTabPress }}
                        options={{
                            tabBarItemStyle: {
                                opacity: currentSessionId ? 0.2 : 1,
                                justifyContent: 'center',
                            },
                            tabBarIcon: ({ color }) => (
                                <IconButton
                                    icon="chart-bell-curve-cumulative"
                                    iconColor={color}
                                    size={26}
                                />
                            ),
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    tabBarItem: {
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
    },
});
