import { View, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    clearCountdown,
    selectActiveSet,
    selectCountdownDuration,
    selectCountdownIntervalId,
    setCountdownDuration,
    setCountdownEndTime,
    setCountdownIntervalId,
    startCountdown,
} from '../../features/currentSession';
import { useObject } from '@realm/react';
import { IconButton, Text } from 'react-native-paper';
import { BSON } from 'realm';
import NumberInput from '../shared/NumberInput';
import { useEffect, useState } from 'react';
import { formatDuration } from '../../app/utils';
import { useAppTheme } from '../../app/theme';
import { SessionSet } from '../../models/Session';

type RestTimerProps = {};

export default function RestTimer({}: RestTimerProps) {
    const [localCountdown, setLocalCountdown] = useState<number>(0);
    const [pause, setPause] = useState<boolean>(false);

    const activeSetId: string | undefined = useAppSelector(selectActiveSet);
    const countdownDuration: number = useAppSelector(selectCountdownDuration);
    const countdownIntervalId: NodeJS.Timeout | undefined = useAppSelector(
        selectCountdownIntervalId
    );
    const activeSet: SessionSet | null = useObject(
        SessionSet,
        new BSON.ObjectId(activeSetId)
    );

    const theme = useAppTheme();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (activeSet && activeSet.recupDuration) {
            // Change the countdown only if it's not running
            if (!countdownIntervalId) {
                setPause(false);
                console.log(activeSet.recupDuration);
                dispatch(setCountdownDuration(activeSet.recupDuration));
            }
            setLocalCountdown(activeSet.recupDuration);
        }
    }, [activeSet]);

    const onLocalCountdownChange = (value: string) => {
        dispatch(clearCountdown(Number(value) || 0));
        setLocalCountdown(Number(value) || 0);
    };

    const onPlayIconPress = () => {
        const countdownEndDate: Date = new Date(
            new Date().getTime() +
                // By default, the countdown duration is the recup duration of the active set
                // If the user has paused the countdown, the countdown duration is the remaining time
                (pause ? countdownDuration : activeSet?.recupDuration!) * 1000
        );
        const countdownEndTime: number = countdownEndDate.getTime() + 1000;
        dispatch(setCountdownEndTime(Math.round(countdownEndTime)));
        dispatch(startCountdown());
        setPause(false);
    };

    const PlayPauseIcon = (): React.JSX.Element => {
        if (countdownIntervalId) {
            return (
                <IconButton
                    icon="pause"
                    onPress={() => {
                        setPause(true);
                        dispatch(setCountdownIntervalId(undefined));
                        dispatch(setCountdownEndTime(undefined));
                    }}
                    mode="contained"
                />
            );
        } else {
            return (
                <IconButton
                    icon="play"
                    onPress={onPlayIconPress}
                    mode="contained"
                />
            );
        }
    };

    return (
        <View
            style={{
                ...styles.container,
                backgroundColor: theme.colors.elevation.level1,
            }}
        >
            <View style={styles.timerContainer}>
                <Text style={styles.timerText}>
                    {formatDuration(countdownDuration || 0)}
                </Text>
            </View>
            <View style={styles.rightContainer}>
                <NumberInput
                    label="Rest (s)"
                    value={localCountdown ? localCountdown.toString() : ''}
                    changeHandler={(value) => onLocalCountdownChange(value)}
                    noError
                    style={{ width: 81 }}
                    dense
                />
                <View style={styles.actionButtonsContainer}>
                    <IconButton
                        icon="stop"
                        onPress={() => dispatch(clearCountdown(localCountdown))}
                        mode="contained"
                    />
                    {PlayPauseIcon()}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingTop: 15,
        paddingBottom: 7,
    },
    timerContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerText: {
        fontSize: 50,
        fontWeight: 'bold',
    },
    rightContainer: {
        alignItems: 'center',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
    },
});
