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
});
