import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { DARK_THEME } from './theme';
import MyText from './components/shared/MyText';

export default function App() {
    return (
        <View style={styles.container}>
            <MyText text="Open up App.tsx to start working on your app!"></MyText>
            <StatusBar style="auto" />
        </View>
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
