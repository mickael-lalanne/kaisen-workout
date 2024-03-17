import { MD3LightTheme as DefaultTheme, useTheme } from 'react-native-paper';
import BlueTheme from '../assets/themes/blue.json';
import OrangeTheme from '../assets/themes/orange.json';
import { EThemeColor } from '../models/Preferences';

// To add more themes, use this site : https://material-foundation.github.io/material-theme-builder/

const COMMON_COLORS = {
    info: '#48cae4',
};

const LIGHT_COMMON_COLORS = {
    success: '#5cb85c',
    inProgress: '#FFEA00',
};
const DARK_COMMON_COLORS = {
    success: '#254520',
    inProgress: '#FFC30B',
};

export const BLUE_LIGHT_THEME = {
    ...DefaultTheme,
    colors: {
        ...COMMON_COLORS,
        ...LIGHT_COMMON_COLORS,
        ...BlueTheme.light,
    },
};

export const BLUE_DARK_THEME = {
    ...DefaultTheme,
    colors: {
        ...COMMON_COLORS,
        ...DARK_COMMON_COLORS,
        ...BlueTheme.dark,
    },
};

export const ORANGE_LIGHT_THEME = {
    ...DefaultTheme,
    colors: {
        ...COMMON_COLORS,
        ...LIGHT_COMMON_COLORS,
        ...OrangeTheme.light,
    },
};

export const ORANGE_DARK_THEME = {
    ...DefaultTheme,
    colors: {
        ...COMMON_COLORS,
        ...DARK_COMMON_COLORS,
        ...OrangeTheme.dark,
    },
};

export type AppTheme =
    | typeof BLUE_LIGHT_THEME
    | typeof BLUE_DARK_THEME
    | typeof ORANGE_LIGHT_THEME
    | typeof ORANGE_DARK_THEME;

export const useAppTheme = () => useTheme<AppTheme>();

export const PREFERENCES_THEMES: {
    color: EThemeColor;
    darkPrimary: string;
    lightPrimary: string;
}[] = [
    {
        color: EThemeColor.Orange,
        darkPrimary: ORANGE_DARK_THEME.colors.primary,
        lightPrimary: ORANGE_LIGHT_THEME.colors.primary,
    },
    {
        color: EThemeColor.Blue,
        darkPrimary: BLUE_DARK_THEME.colors.primary,
        lightPrimary: BLUE_LIGHT_THEME.colors.primary,
    },
];
