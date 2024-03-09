import { View, StyleSheet, Image } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { useAppTheme } from '../app/theme';
import { RouterProps } from '../app/router';

export default function ProgressionScreen({ navigation }: RouterProps) {
    const theme = useAppTheme();

    return (
        <View style={{...styles.viewContainer, backgroundColor: theme.colors.surface}}>
            <HeaderBar navigation={navigation}></HeaderBar>

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
