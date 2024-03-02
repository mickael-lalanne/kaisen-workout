import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';

// Define a type for the slice state
export interface PreferencesState {
    darkMode: boolean;
}

// Define the initial state using that type
const initialState: PreferencesState = {
    darkMode: true,
};

export const preferencesSlice = createSlice({
    name: 'darkMode',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setDarkMode: (state, action: PayloadAction<boolean>) => {
            state.darkMode = action.payload;
        }
    },
});

export const { setDarkMode } = preferencesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectDarkMode = (state: RootState) => state.preferences.darkMode;

export default preferencesSlice.reducer;
