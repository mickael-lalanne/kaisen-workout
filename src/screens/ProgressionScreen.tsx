import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '../app/theme';
import { EScreens, RouterProps } from '../app/router';
import { createStackNavigator } from '@react-navigation/stack';
import ProgressionReportScreen from './ProgressionReportScreen';
import ProgressionDataTableScreen from './ProgressionDataTableScreen';

export default function ProgressionScreen({ navigation }: RouterProps) {
    const theme = useAppTheme();
    const Stack = createStackNavigator();

    return (
        <View style={{...styles.viewContainer, backgroundColor: theme.colors.surface}}>
            <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={EScreens.ProgressionHome}>
                <Stack.Screen name={EScreens.ProgressionHome} component={ProgressionDataTableScreen} />
                <Stack.Screen name={EScreens.ProgressionReport} component={ProgressionReportScreen} />
            </Stack.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
});
