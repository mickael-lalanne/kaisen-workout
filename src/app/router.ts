import type { DrawerNavigationProp } from '@react-navigation/drawer';

export enum EScreens {
    Program = 'Program',
    Workout = 'Workout',
    ProgramHome = 'Program Home',
    ProgramBuilder = 'Program Builder',
    ProgramViewer = 'Program Viewer',
    Exercises = 'Exercises',
    WorkoutHome = 'Workout Home',
    WorkoutSession = 'Workout Session',
    Progression = 'Progression',
}

type RootStackParamList = {
    [EScreens.Program]: undefined;
    [EScreens.ProgramHome]: undefined;
    [EScreens.ProgramBuilder]: undefined | { programId: string };
    [EScreens.Exercises]: undefined;
    [EScreens.Workout]: undefined;
    [EScreens.WorkoutHome]: undefined;
    [EScreens.WorkoutSession]: undefined;
    [EScreens.Progression]: undefined;
};

export type RouterProps = { navigation: DrawerNavigationProp<RootStackParamList>, route?: any };
