import { View, StyleSheet, Image } from 'react-native';
import HeaderBar from '../components/HeaderBar';

export default function ProgressionScreen() {
    return (
        <View style={styles.viewContainer}>
            <HeaderBar></HeaderBar>

            <Image
                source={require('../assets/nanami.png')}
                style={styles.nanami}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    nanami: {
        position: 'absolute',
        bottom: 0,
        right: -25,
        width: 160,
        height: 185,
    },
});
