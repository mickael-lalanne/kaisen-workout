import type { DrawerNavigationProp } from '@react-navigation/drawer';

export enum EScreens {
    Program = 'Program',
    Workout = 'Workout',
    Progression = 'Progression',
    ProgramHome = 'Program Home',
    ProgramBuilder = 'Program Builder',
    ProgramViewer = 'Program Viewer',
}

type RootStackParamList = {
    [EScreens.Program]: undefined;
    [EScreens.ProgramHome]: undefined;
    [EScreens.ProgramBuilder]: undefined;
    [EScreens.Workout]: undefined;
    [EScreens.Progression]: undefined;
};

export type RouterProps = { navigation: DrawerNavigationProp<RootStackParamList>, route?: any };
