import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../app/store';
import { Vibration } from 'react-native';
import {
    VIBRATION_HEAVY_PATTERN,
    VIBRATION_LIGHT_PATTERN,
} from '../app/vibration';

export interface CurrentSessionState {
    countdownDuration: number;
    countdownEndTime?: number;
    countdownIntervalId?: NodeJS.Timeout;
    activeSet?: string;
    id?: string;
}

const initialState: CurrentSessionState = {
    countdownDuration: 0,
    activeSet: undefined,
};

export const currentSessionSlice = createSlice({
    name: 'currentSession',
    initialState,
    reducers: {
        setActiveSet: (state, action: PayloadAction<string>) => {
            state.activeSet = action.payload;
        },
        setCountdownDuration: (state, action: PayloadAction<number>) => {
            state.countdownDuration = action.payload;
        },
        setCountdownEndTime: (
            state,
            action: PayloadAction<number | undefined>
        ) => {
            state.countdownEndTime = action.payload;
        },
        setCountdownIntervalId: (
            state,
            action: PayloadAction<NodeJS.Timeout | undefined>
        ) => {
            state.countdownIntervalId = action.payload;
        },
        clearCountdown: (state, action: PayloadAction<number | undefined>) => {
            state.countdownDuration = action.payload || 0;
            state.countdownIntervalId = undefined;
        },
        setCurrentSessionId: (
            state,
            action: PayloadAction<string | undefined>
        ) => {
            state.id = action.payload;
        },
    },
});

export const {
    setActiveSet,
    setCountdownDuration,
    setCountdownIntervalId,
    clearCountdown,
    setCurrentSessionId,
    setCountdownEndTime,
} = currentSessionSlice.actions;

export const selectActiveSet = (state: RootState) =>
    state.currentSession.activeSet;

export const selectCountdownDuration = (state: RootState) =>
    state.currentSession.countdownDuration;

export const selectCountdownIntervalId = (state: RootState) =>
    state.currentSession.countdownIntervalId;

export const selectCurrentSessionId = (state: RootState) =>
    state.currentSession.id;

export default currentSessionSlice.reducer;

/**
 * Starts the countdown timer.
 * @remarks
 * This function is a Redux thunk action that dispatches actions to update the countdown duration and trigger vibrations at specific timings.
 * @returns A Redux thunk function.
 */
export const startCountdown =
    () => (dispatch: AppDispatch, getState: () => RootState) => {
        const { countdownIntervalId } = getState().currentSession;
        if (countdownIntervalId) {
            return;
        }

        const intervalId = setInterval(() => {
            const { countdownEndTime, countdownIntervalId } =
                getState().currentSession;

            if (!countdownEndTime) {
                return;
            }

            const secondsLeft: number = Math.round(
                (countdownEndTime - new Date().getTime()) / 1000
            );

            if (secondsLeft > 0 && countdownIntervalId) {
                dispatch(setCountdownDuration(secondsLeft - 1));
                // Vibrate when the countdown reaches some specific timings
                if (
                    secondsLeft === 16 ||
                    secondsLeft === 11 ||
                    secondsLeft === 6
                ) {
                    Vibration.vibrate(VIBRATION_LIGHT_PATTERN);
                } else if (secondsLeft === 1) {
                    Vibration.vibrate(VIBRATION_HEAVY_PATTERN);
                }
            } else {
                clearInterval(intervalId);
                dispatch(setCountdownIntervalId(undefined));
                dispatch(setCountdownEndTime(undefined));
            }
        }, 1000);
        dispatch(setCountdownIntervalId(intervalId));
    };
