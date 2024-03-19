import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    slug: 'kaisen-workout',
    name:
        (process.env as any).EXPO_ENVIRONMENT === 'local'
            ? 'Kaisen Workout Local'
            : 'Kaisen Workout',
    android: {
        package:
            (process.env as any).EXPO_ENVIRONMENT === 'local'
                ? 'kaisen.workout.truelocal'
                // For apk env, the package should not have been named kaisen.workout.local
                // But I messed up with configs and I don't want to loose my registered sessions
                : 'kaisen.workout.local',
        softwareKeyboardLayoutMode: 'pan',
    },
    updates: {
        url: 'https://u.expo.dev/33396401-9659-4f40-b091-2a53c8d5c59b',
    },
    runtimeVersion: {
        policy: 'appVersion',
    },
});
