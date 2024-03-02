import { StatusBar } from 'expo-status-bar';
import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme as DefaultDarkTheme,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import HomeScreen from './components/screens/HomeScreen';
import WorkoutScreen from './components/screens/WorkoutScreen';
import ProgramScreen from './components/screens/ProgramScreen';
import { DARK_THEME, LIGHT_THEME } from './theme';
import DrawerContent from './components/DrawerContent';
import { EScreens } from './router';
import { useAppSelector } from './app/hooks';
import { selectDarkMode } from './features/preferences';

const Drawer = createDrawerNavigator();
const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: DefaultTheme,
    reactNavigationDark: DefaultDarkTheme,
});

// An AppChild component is needed to access the preferences stored in redux 
export default function AppChild() {
    const darkMode: boolean = useAppSelector(selectDarkMode);

    return (
        <PaperProvider theme={darkMode ? DARK_THEME : LIGHT_THEME}>
            <NavigationContainer theme={darkMode ? DarkTheme : LightTheme}>
                <StatusBar style={darkMode ? 'light' : 'dark'} />
                <Drawer.Navigator
                    drawerContent={(props) => <DrawerContent {...props} />}
                    initialRouteName={EScreens.Home}
                >
                    <Drawer.Screen name={EScreens.Home} component={HomeScreen} />
                    <Drawer.Screen name={EScreens.Workout} component={WorkoutScreen} />
                    <Drawer.Screen name={EScreens.Program} component={ProgramScreen} />
                </Drawer.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}
