import { View, StyleSheet, Pressable, Dimensions, Image } from 'react-native';
import { EScreens, RouterProps } from '../router';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { useState } from 'react';

export default function HomeScreen({ navigation }: RouterProps) {
    const [pressed, setPressed] = useState<EScreens>();

    const theme = useAppTheme();

    const HomeButton = (screen: EScreens) => (
        <Pressable
            style={[
                styles.button,
                {
                    borderColor: theme.colors.text,
                    backgroundColor: pressed === screen ? theme.colors.text : undefined,
                },
            ]}
            onPress={() => navigation.navigate(screen)}
            onPressIn={() => setPressed(screen)}
            onPressOut={() => setPressed(undefined)}
        >
            <Text
                style={{
                    ...styles.text,
                    color:
                        pressed === screen
                            ? theme.colors.background
                            : theme.colors.text,
                }}
            >
                {screen}
            </Text>
        </Pressable>
    );

    return (
        <View style={styles.viewContainer}>
            <View style={{ flex: 1 }}></View>
            <Text style={styles.title}>Become strong like Gojo</Text>
            <View style={{ flex: 1 }}></View>

            {HomeButton(EScreens.Program)}

            {HomeButton(EScreens.Workout)}

            <Image
                source={require('../assets/gojo.png')}
                style={styles.gojo}
            />
            <View style={{ flex: 3.2 }}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        padding: 25,
        marginVertical: 20,
        borderWidth: 2,
        width: Dimensions.get('window').width / 2,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    title: {
        fontSize: 20,
        fontStyle: 'italic'
    },
    text: {
        textTransform: 'uppercase'
    },
    gojo: {
        position: 'absolute',
        bottom: 0,
        maxHeight: Dimensions.get('window').height * 0.4,
        objectFit: 'contain',
    },
});
