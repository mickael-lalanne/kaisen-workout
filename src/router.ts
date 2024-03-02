import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export enum EScreens {
    Home = 'Kaisen Workout - Home',
    Program = 'Program',
    Workout = 'Workout',
}

type RootStackParamList = {
    [EScreens.Program]: undefined;
    [EScreens.Program]: undefined;
    [EScreens.Workout]: undefined;
};

export type RouterProps = NativeStackScreenProps<RootStackParamList>;
