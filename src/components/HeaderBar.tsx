import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    Appbar,
    IconButton,
    Menu,
    Switch,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectDarkMode, setDarkMode } from '../features/preferences';
import {
    CommonActions,
    getFocusedRouteNameFromRoute,
    useRoute,
} from '@react-navigation/native';
import { EScreens, RouterProps } from '../app/router';
import ConfirmDialog from './shared/ConfirmDialog';
import { useQuery, useRealm } from '@realm/react';
import { ESessionState, Session } from '../models/Session';

interface HeaderBarProps {
    navigation: RouterProps['navigation'];
}

export default function HeaderBar({ navigation }: HeaderBarProps) {
    const [visible, setVisible] = useState<boolean>(false);
    const [cancelSession, setCancelSession] = useState<boolean>(false);
    const [finishSession, setFinishSession] = useState<boolean>(false);
    const [routeName, setRouteName] = useState<EScreens>();

    const darkMode: boolean = useAppSelector(selectDarkMode);
    const dispatch = useAppDispatch();
    const route = useRoute();
    const theme = useTheme();
    const realm = useRealm();

    const BACKGROUND_COLOR = theme.colors.secondaryContainer;

    // TODO : duplicate code
    const session: Session | undefined = useQuery(Session, (collection) =>
        collection
            .sorted('date')
            .filtered('state == $0', ESessionState.InProgress)
    ).at(0);

    useEffect(() => {
        setRouteName(
            (getFocusedRouteNameFromRoute(route) ?? route.name) as EScreens
        );
    }, [route]);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const _getTitle = (): string => {
        switch (routeName) {
            case EScreens.Workout:
            case EScreens.WorkoutHome:
                return '⚔️  Perform like Toji';
            case EScreens.WorkoutSession:
                return 'Session in progress';
            case EScreens.Progression:
                return '📈  Analyze like Nanami';
            case EScreens.ProgramBuilder:
                return 'Program Creation';
            case EScreens.Exercises:
                return 'Exercises';
            case EScreens.Program:
            case EScreens.ProgramHome:
            default:
                return '👑  Outclass like Gojo';
        }
    };

    const endSession = (state: ESessionState) => {
        realm.write(() => {
            if (session) {
                session.state = ESessionState.Canceled;
            }
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: EScreens.Workout }],
                })
            );
        });
    };

    const GoBackIcon = (): React.JSX.Element | undefined => {
        const showBackIcon =
            routeName === EScreens.ProgramBuilder ||
            routeName === EScreens.Exercises ||
            routeName === EScreens.WorkoutSession;

        const pressHandler =
            routeName === EScreens.WorkoutSession
                ? () => setCancelSession(true)
                : () => navigation.goBack();

        if (showBackIcon) {
            return <Appbar.BackAction onPress={() => pressHandler()} />;
        }
    };

    const FinishSessionIcon = (): React.JSX.Element | undefined => {
        if (routeName === EScreens.WorkoutSession) {
            return (
                <IconButton
                    icon="check-circle-outline"
                    mode="contained"
                    size={33}
                    style={{ backgroundColor: BACKGROUND_COLOR }}
                    onPress={() => setFinishSession(true)}
                />
            );
        }
    };

    return (
        <Appbar.Header style={{ backgroundColor: BACKGROUND_COLOR }}>
            {GoBackIcon()}
            <Appbar.Content
                title={_getTitle()}
                titleStyle={{ fontSize: 17, fontWeight: 'bold' }}
            />
            {FinishSessionIcon()}
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <Appbar.Action
                        icon="dots-vertical"
                        onPress={openMenu}
                    ></Appbar.Action>
                }
            >
                <TouchableRipple
                    onPress={() => dispatch(setDarkMode(!darkMode))}
                >
                    <View style={styles.preference}>
                        <Text>Dark mode</Text>
                        <View pointerEvents="none">
                            <Switch value={darkMode} />
                        </View>
                    </View>
                </TouchableRipple>
            </Menu>

            <ConfirmDialog
                visible={cancelSession}
                cancelHandler={() => setCancelSession(false)}
                title="Cancel session"
                content="Are you sure you want to cancel the current session ?"
                confirmHandler={() => endSession(ESessionState.Canceled)}
            />

            <ConfirmDialog
                visible={finishSession}
                cancelHandler={() => setFinishSession(false)}
                title="Another day, Another win 😼"
                content="Are you sure you want to finish the current session ?"
                confirmHandler={() => endSession(ESessionState.Done)}
            />
        </Appbar.Header>
    );
}

const styles = StyleSheet.create({
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});
