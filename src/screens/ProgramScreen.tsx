import { View, StyleSheet, Dimensions, Image } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, Button } from 'react-native-paper';
import { EScreens, RouterProps } from '../app/router';
import ProgramBuilder from '../components/ProgramBuilder';
import HeaderBar from '../components/HeaderBar';

export default function ProgramScreen({ route, navigation }: RouterProps) {
    const Stack = createStackNavigator();

    /**
     * Called when the "Add program" button has been clicked
     * Use the navigation with the mode param to show the Program Builder
     */
    const showBuilder = (): void => {
        // navigation.navigate({ name: EScreens.Program, mode: EProgramMode.builder });
        // navigation.navigate({
        //     name: EScreens.Program,
        //     params: { mode: postText },
        //     merge: true,
        //   });
    };

    // const ProgramMode = (): React.JSX.Element => {
    //     switch (route) {
    //         case EProgramMode.builder:
    //             return <ProgramBuilder />;

    //         default:
    //             // return <Button mode="contained" onPress={showBuilder}>New program</Button>;
    //             return <Stack.Navigator>
    //                 <Stack.Screen name={EScreens.ProgramBuilder} component={ProgramBuilder} options={{title: 'HEY'}} />
    //                 <Stack.Screen name={EScreens.ProgramViewer} component={ProgramBuilder} options={{title: 'SALUT'}} />
    //             </Stack.Navigator>;
    //     }
    // };

    return (
        <View style={styles.viewContainer}>
            <HeaderBar></HeaderBar>
            <View style={{ flex: 1 }}></View>

            {/* <Stack.Navigator>
                    <Stack.Screen name={EScreens.ProgramBuilder} component={ProgramBuilder} options={{title: 'HEY'}} />
                    <Stack.Screen name={EScreens.ProgramViewer} component={ProgramBuilder} options={{title: 'SALUT'}} />
                </Stack.Navigator> */}
            <Button
                icon="camera"
                mode="outlined"
                onPress={() => navigation.navigate(EScreens.ProgramBuilder)}
            >
                New Program
            </Button>

            <Image source={require('../assets/gojo.png')} style={styles.gojo} resizeMode='contain' />
            <View style={{ flex: 3.2 }}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    title: {
        fontSize: 15,
        fontStyle: 'italic',
        marginTop: 20,
    },
    gojo: {
        position: 'absolute',
        bottom: 0,
        left: -5,
        width: 150,
        height: 250,
    },
});
