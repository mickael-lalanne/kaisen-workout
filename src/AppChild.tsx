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
    Text,
    adaptNavigationTheme,
} from 'react-native-paper';
import ProgressionScreen from './screens/ProgressionScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import ProgramScreen from './screens/ProgramScreen';
import {
    AppTheme,
    BLUE_DARK_THEME,
    BLUE_LIGHT_THEME,
    ORANGE_DARK_THEME,
    ORANGE_LIGHT_THEME,
} from './app/theme';
import { EScreens } from './app/router';
import { useQuery, useRealm } from '@realm/react';
import { EThemeColor, EWeightUnit, Preferences } from './models/Preferences';
import HeaderBar from './components/HeaderBar';
import { StyleSheet } from 'react-native';
import { useAppSelector } from './app/hooks';
import { selectCurrentSessionId } from './features/currentSession';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';

const Tab = createBottomTabNavigator();
const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: DefaultTheme,
    reactNavigationDark: DefaultDarkTheme,
});

// An AppChild component is needed to access the preferences stored in redux
export default function AppChild() {
    const [focusColor, setFocusColor] = useState(
        ORANGE_DARK_THEME.colors.primary
    );
    const [textColor, setTextColor] = useState(
        ORANGE_DARK_THEME.colors.inverseSurface
    );
    const [theme, setTheme] = useState<AppTheme>(ORANGE_DARK_THEME);

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
                theme: EThemeColor.Orange,
            });
        });
    }

    const darkMode: boolean =
        !preferences || preferences.darkMode ? true : false;
    const currentSessionId: string | undefined = useAppSelector(
        selectCurrentSessionId
    );

    useEffect(() => {
        if (!preferences) return;

        let themeToApply: AppTheme;
        switch (preferences.theme) {
            case EThemeColor.Blue:
                themeToApply = preferences.darkMode
                    ? BLUE_DARK_THEME
                    : BLUE_LIGHT_THEME;
                break;

            case EThemeColor.Orange:
            default:
                themeToApply = preferences.darkMode
                    ? ORANGE_DARK_THEME
                    : ORANGE_LIGHT_THEME;
                break;
        }

        setTheme(themeToApply);
        setFocusColor(themeToApply.colors.primary);
        setTextColor(themeToApply.colors.inverseSurface);
    }, [preferences?.darkMode, preferences?.theme]);

    const onTabPress = (e: EventArg<'tabPress', true, undefined>) => {
        if (currentSessionId) {
            e.preventDefault();
            return;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const TabBarLabel = (text: string, focus: boolean): React.JSX.Element => {
        return (
            <Text
                style={{
                    ...styles.tabBarLabel,
                    color: focus ? focusColor : textColor,
                }}
            >
                {text}
            </Text>
        );
    };

    return (
        <PaperProvider theme={theme}>
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
                                ? theme.colors.surfaceContainerLow
                                : theme.colors.surfaceContainerLow,
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
                            tabBarActiveTintColor: focusColor,
                            tabBarIcon: ({ focused }) => (
                                <IconButton
                                    icon="file-document-edit-outline"
                                    iconColor={focused ? focusColor : textColor}
                                    size={26}
                                />
                            ),
                            tabBarLabel: (props) =>
                                TabBarLabel('Program', props.focused),
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
                            tabBarActiveTintColor: focusColor,
                            tabBarIcon: ({ focused }) => (
                                <IconButton
                                    icon="weight-lifter"
                                    iconColor={focused ? focusColor : textColor}
                                    size={26}
                                />
                            ),
                            tabBarLabel: (props) =>
                                TabBarLabel('Workout', props.focused),
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
                            tabBarActiveTintColor: focusColor,
                            tabBarIcon: ({ focused }) => (
                                <IconButton
                                    icon="chart-bell-curve-cumulative"
                                    iconColor={focused ? focusColor : textColor}
                                    size={26}
                                />
                            ),
                            tabBarLabel: (props) =>
                                TabBarLabel('Progression', props.focused),
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
    tabBarLabel: {
        fontSize: 10,
    },
});
