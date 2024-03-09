import type { DrawerNavigationProp } from '@react-navigation/drawer';

export enum EScreens {
    Program = 'Program',
    Workout = 'Workout',
    Progression = 'Progression',
    ProgramHome = 'Program Home',
    ProgramBuilder = 'Program Builder',
    ProgramViewer = 'Program Viewer',
    Exercises = 'Exercises',
}

type RootStackParamList = {
    [EScreens.Program]: undefined;
    [EScreens.ProgramHome]: undefined;
    [EScreens.ProgramBuilder]: undefined | { programId: string };
    [EScreens.Workout]: undefined;
    [EScreens.Progression]: undefined;
    [EScreens.Exercises]: undefined;
};

export type RouterProps = { navigation: DrawerNavigationProp<RootStackParamList>, route?: any };
