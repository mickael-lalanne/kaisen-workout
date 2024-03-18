import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    slug: 'kaisen-workout',
    name: 'Kaisen Workout',
    android: {
        package:
            (process.env as any).EXPO_ENVIRONMENT === 'local'
                ? 'kaisen.workout.local'
                : 'kaisen.workout',
        softwareKeyboardLayoutMode: 'pan',
    },
    updates: {
        url: 'https://u.expo.dev/33396401-9659-4f40-b091-2a53c8d5c59b',
    },
    runtimeVersion: {
        policy: 'appVersion',
    },
});
