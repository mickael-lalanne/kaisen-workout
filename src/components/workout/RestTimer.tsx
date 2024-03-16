import { View, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    clearCoutdown,
    selectActiveSet,
    selectCountdown,
    selectCountdownIntervalId,
    setCountdown,
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

    const activeSetId: string | undefined = useAppSelector(selectActiveSet);
    const countdown: number = useAppSelector(selectCountdown);
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
            dispatch(setCountdown(activeSet.recupDuration));
            setLocalCountdown(activeSet.recupDuration);
        }
    }, [activeSet]);

    const onLocalCountdownChange = (value: string) => {
        dispatch(clearCoutdown(Number(value) || 0));
        setLocalCountdown(Number(value) || 0);
    };

    const PlayPauseIcon = (): React.JSX.Element => {
        if (countdownIntervalId) {
            return (
                <IconButton
                    icon="pause"
                    onPress={() => dispatch(setCountdownIntervalId(undefined))}
                    mode="contained"
                />
            );
        } else {
            return (
                <IconButton
                    icon="play"
                    onPress={() => dispatch(startCountdown())}
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
                    {formatDuration(countdown || 0)}
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
                        onPress={() => dispatch(clearCoutdown(localCountdown))}
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
