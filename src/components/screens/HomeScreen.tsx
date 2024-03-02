import { View, StyleSheet, Button } from 'react-native';
import MyText from '../shared/MyText';
import { DARK_THEME } from '../../theme';
import { EScreens, RouterProps } from '../../router';

export default function HomeScreen({ navigation }: RouterProps) {
    return (
        <View style={styles.viewContainer}>
            <MyText text="Home Screen"></MyText>
            <Button
                title="Go to Program"
                onPress={() => navigation.navigate(EScreens.Program)}
            />
            <Button
                title="Go to Workout"
                onPress={() => navigation.navigate(EScreens.Workout)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DARK_THEME.background,
    },
});
