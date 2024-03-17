import { View, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { EScreens, RouterProps } from '../app/router';
import { useAppTheme } from '../app/theme';
import ProgramSelector from '../components/workout/ProgramSelector';
import { useState } from 'react';
import { useQuery, useRealm } from '@realm/react';
import { Program } from '../models/Program';
import InfoBox from '../components/shared/InfoBox';
import { initSession } from '../services/SessionService';
import * as Haptics from 'expo-haptics';
import { useAppDispatch } from '../app/hooks';
import { setActiveSet } from '../features/currentSession';
import { Session } from '../models/Session';

export default function WorkoutHomeScreen({ navigation }: RouterProps) {
    const [programSelectorVisible, setProgramSelectorVisible] =
        useState<boolean>(false);

    const theme = useAppTheme();
    const programs = useQuery(Program);
    const realm = useRealm();
    const dispatch = useAppDispatch();

    const onProgramSelected = (program: Program) => {
        const newSession: Session = initSession(realm, program);
        navigation.navigate(EScreens.WorkoutSession);
        setProgramSelectorVisible(false);
        dispatch(setActiveSet(newSession.sets[0]._id.toString()));
    };

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

    const onStartWorkoutPress = () => {
        if (programs.length === 0) { return; }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setProgramSelectorVisible(true);
    };

    return (
        <View
            style={{
                ...styles.viewContainer,
                backgroundColor: theme.colors.surface,
            }}
        >
            {/* TODO : add title */}

            <View style={{ height: 180 }}>{NoProgramMessage()}</View>

            <Button
                style={styles.workoutBtn}
                contentStyle={{ height: 100 }}
                mode="contained-tonal"
                textColor={
                    programs.length === 0
                        ? theme.colors.surfaceContainerHighest
                        : theme.colors.onPrimary
                }
                buttonColor={
                    programs.length === 0
                        ? theme.colors.surfaceContainerLow
                        : theme.colors.primary
                }
                onPress={onStartWorkoutPress}
            >
                START WORKOUT
            </Button>

            <ProgramSelector
                programs={programs}
                selectHandler={onProgramSelected}
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

const WORKOUT_BTN_STYLE = {
    borderRadius: 5,
    marginVertical: 20,
    marginHorizontal: 50,
};

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
    workoutBtn: WORKOUT_BTN_STYLE,
    workoutBtnDisable: {
        ...WORKOUT_BTN_STYLE,
        opacity: 0.2,
        pointerEvents: 'none',
    },
    noProgramText: {
        fontSize: 12,
        fontStyle: 'italic',
        margin: 20,
    },
});
