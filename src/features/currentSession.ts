import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../app/store';
import { Vibration } from 'react-native';
import {
    VIBRATION_HEAVY_PATTERN,
    VIBRATION_LIGHT_PATTERN,
} from '../app/vibration';

export interface CurrentSessionState {
    countdown: number;
    countdownIntervalId?: NodeJS.Timeout;
    activeSet?: string;
    id?: string;
}

const initialState: CurrentSessionState = {
    countdown: 0,
    activeSet: undefined,
};

export const currentSessionSlice = createSlice({
    name: 'currentSession',
    initialState,
    reducers: {
        setActiveSet: (state, action: PayloadAction<string>) => {
            state.activeSet = action.payload;
        },
        setCountdown: (state, action: PayloadAction<number>) => {
            state.countdown = action.payload;
        },
        setCountdownIntervalId: (
            state,
            action: PayloadAction<NodeJS.Timeout | undefined>
        ) => {
            state.countdownIntervalId = action.payload;
        },
        clearCoutdown: (state, action: PayloadAction<number | undefined>) => {
            state.countdown = action.payload || 0;
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
    setCountdown,
    setCountdownIntervalId,
    clearCoutdown,
    setCurrentSessionId,
} = currentSessionSlice.actions;

export const selectActiveSet = (state: RootState) =>
    state.currentSession.activeSet;

export const selectCountdown = (state: RootState) =>
    state.currentSession.countdown;

export const selectCountdownIntervalId = (state: RootState) =>
    state.currentSession.countdownIntervalId;

export const selectCurrentSessionId = (state: RootState) =>
    state.currentSession.id;

export default currentSessionSlice.reducer;

/**
 * Decrements the countdown value by 1 every second until it reaches 0.
 * Dispatches the `startCountdown` action to update the countdown value in the Redux store.
 * Stops the countdown when the countdown value reaches 0.
 */
export const startCountdown =
    () => (dispatch: AppDispatch, getState: () => RootState) => {
        const { countdownIntervalId } = getState().currentSession;
        if (countdownIntervalId) {
            return;
        }

        const intervalId = setInterval(() => {
            const { countdown, countdownIntervalId } =
                getState().currentSession;
            if (countdown > 0 && countdownIntervalId) {
                dispatch(setCountdown(countdown - 1));
                // Vibrate when the countdown reaches some specific timings
                if (countdown === 16 ||countdown === 11 || countdown === 6) {
                    Vibration.vibrate(VIBRATION_LIGHT_PATTERN);
                } else if (countdown === 1) {
                    Vibration.vibrate(VIBRATION_HEAVY_PATTERN);
                }
            } else {
                clearInterval(intervalId);
                dispatch(setCountdownIntervalId(undefined));
            }
        }, 1000);
        dispatch(setCountdownIntervalId(intervalId));
    };
