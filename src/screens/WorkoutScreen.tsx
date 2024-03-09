import { View, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import HeaderBar from '../components/HeaderBar';
import { RouterProps } from '../app/router';
import { useAppTheme } from '../app/theme';
import ProgramSelector from '../components/workout/ProgramSelector';
import { useState } from 'react';
import { useQuery } from '@realm/react';
import { Program } from '../models/Program';
import InfoBox from '../components/shared/InfoBox';

export default function WorkoutScreen({ navigation }: RouterProps) {
    const [programSelectorVisible, setProgramSelectorVisible] =
        useState<boolean>(false);

    const theme = useAppTheme();
    const programs = useQuery(Program);

    const NoProgramMessage = (): React.JSX.Element | undefined => {
        if (programs.length === 0) {
            return (
                <InfoBox
                    style={{ margin: 20 }}
                    text={`It seems you don't have any programs yet.\nGo to Program tab to create one !`}
                />
            );
        }
    };

    return (
        <View
            style={{
                ...styles.viewContainer,
                backgroundColor: theme.colors.surface,
            }}
        >
            <HeaderBar navigation={navigation}></HeaderBar>

            {/* TODO : add title */}

            <View style={{ height: 180 }}>
                {NoProgramMessage()}
            </View>

            <Button
                style={styles.workoutBtn}
                contentStyle={{ height: 100 }}
                mode="contained"
                onPress={() => setProgramSelectorVisible(true)}
                disabled={programs.length === 0}
            >
                START WORKOUT
            </Button>

            <ProgramSelector
                programs={programs}
                visible={programSelectorVisible}
                hideHandler={() => setProgramSelectorVisible(false)}
            />

            <View style={styles.bottomImageContainer}>
                <Image
                    source={require('../assets/toji.png')}
                    style={styles.toji}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    bottomImageContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    toji: {
        marginRight: 100,
        height: 280,
    },
    workoutBtn: {
        borderRadius: 5,
        marginVertical: 20,
        marginHorizontal: 50,
    },
    noProgramText: {
        fontSize: 12,
        fontStyle: 'italic',
        margin: 20,
    },
});
