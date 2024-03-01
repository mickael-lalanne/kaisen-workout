import { View, StyleSheet } from 'react-native';
import MyText from '../shared/MyText';
import { DARK_THEME } from '../../theme';

export default function ProgramScreen() {
    return (
        <View style={styles.viewContainer}>
            <MyText text="Program Screen"></MyText>
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
