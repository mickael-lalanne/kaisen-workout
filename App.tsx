import { StatusBar } from 'expo-status-bar';
import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme as DefaultDarkTheme,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { RealmProvider } from '@realm/react';
import { PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import HomeScreen from './src/components/screens/HomeScreen';
import WorkoutScreen from './src/components/screens/WorkoutScreen';
import ProgramScreen from './src/components/screens/ProgramScreen';
import { Exercise } from './src/models/Exercise';
import { theme } from './src/theme';
import DrawerContent from './src/components/DrawerContent';
import { EScreens } from './src/router';

const Drawer = createDrawerNavigator();
const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: DefaultTheme,
    reactNavigationDark: DefaultDarkTheme,
});

export default function App() {
    return (
        <RealmProvider schema={[Exercise]}>
            <PaperProvider theme={theme}>
                <NavigationContainer theme={DarkTheme}>
                    <StatusBar style="dark" />
                    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />} initialRouteName={EScreens.Home}>
                        <Drawer.Screen name={EScreens.Home} component={HomeScreen} />
                        <Drawer.Screen name={EScreens.Workout} component={WorkoutScreen} />
                        <Drawer.Screen name={EScreens.Program} component={ProgramScreen} />
                    </Drawer.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </RealmProvider>
    );
}
