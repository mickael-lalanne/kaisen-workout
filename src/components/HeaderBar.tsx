import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    Appbar,
    IconButton,
    Menu,
    RadioButton,
    Switch,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import {
    CommonActions,
    getFocusedRouteNameFromRoute,
    useRoute,
} from '@react-navigation/native';
import { EScreens, RouterProps } from '../app/router';
import ConfirmDialog from './shared/ConfirmDialog';
import { useObject, useQuery, useRealm } from '@realm/react';
import { ESessionState, Session } from '../models/Session';
import { EWeightUnit, Preferences } from '../models/Preferences';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    selectCurrentSessionId,
    setCurrentSessionId,
} from '../features/currentSession';
import { BSON } from 'realm';
import * as Haptics from 'expo-haptics';

interface HeaderBarProps {
    navigation: RouterProps['navigation'];
}

export default function HeaderBar({ navigation }: HeaderBarProps) {
    const [visible, setVisible] = useState<boolean>(false);
    const [cancelSession, setCancelSession] = useState<boolean>(false);
    const [finishSession, setFinishSession] = useState<boolean>(false);
    const [routeName, setRouteName] = useState<EScreens>();

    const route = useRoute();
    const theme = useTheme();
    const realm = useRealm();
    const dispatch = useAppDispatch();
    const currentSessionId: string | undefined = useAppSelector(
        selectCurrentSessionId
    );

    const BACKGROUND_COLOR = theme.colors.secondaryContainer;

    const session: Session | null = useObject(
        Session,
        new BSON.ObjectId(currentSessionId)
    );

    const preferences: Preferences | undefined = useQuery(
        Preferences,
        (collection) => collection
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
                return (
                    new Date().toLocaleDateString('en-US', {
                        month: 'long',
                        day: '2-digit',
                    }) + ' session'
                );
            case EScreens.Progression:
            case EScreens.ProgressionHome:
                return '📈  Analyze like Nanami';
            case EScreens.ProgressionReport:
                return 'Session Report';
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
                session.state = state;
                session.endDate = new Date();
            }
            dispatch(setCurrentSessionId(undefined));
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: EScreens.Workout }],
                })
            );
        });
    };

    const setDarkMode = (value: boolean) => {
        realm.write(() => {
            if (preferences) {
                preferences.darkMode = value;
            }
        });
    };

    const setWeightUnit = (value: EWeightUnit) => {
        realm.write(() => {
            if (preferences) {
                preferences.weightUnit = value;
            }
        });
    };

    const GoBackIcon = (): React.JSX.Element | undefined => {
        const showBackIcon =
            routeName === EScreens.ProgramBuilder ||
            routeName === EScreens.Exercises ||
            routeName === EScreens.WorkoutSession ||
            routeName === EScreens.ProgressionReport;

        let backRoute: EScreens;
        switch (routeName) {
            case EScreens.ProgramBuilder:
                backRoute = EScreens.ProgramHome;
                break;
            case EScreens.Exercises:
                backRoute = EScreens.ProgramHome;
                break;
            case EScreens.WorkoutSession:
                backRoute = EScreens.WorkoutHome;
                break;
            case EScreens.ProgressionReport:
                backRoute = EScreens.ProgressionHome;
                break;
            default:
                backRoute = EScreens.WorkoutHome;
                break;
        }

        const pressHandler =
            routeName === EScreens.WorkoutSession
                ? () => {
                      setCancelSession(true);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                : () => navigation.navigate(backRoute as any);

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
                    onPress={() => {
                        setFinishSession(true);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    }}
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
                    onPress={() => setDarkMode(!preferences?.darkMode)}
                >
                    <View style={styles.preference}>
                        <Text>Dark mode</Text>
                        <View pointerEvents="none">
                            <Switch value={preferences?.darkMode} />
                        </View>
                    </View>
                </TouchableRipple>

                <Text style={styles.menuTitle}>Weight unit</Text>
                <RadioButton.Group
                    onValueChange={(value) =>
                        setWeightUnit(value as EWeightUnit)
                    }
                    value={preferences?.weightUnit || EWeightUnit.KG}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 25,
                        }}
                    >
                        <View style={styles.radioBtnContainer}>
                            <Text style={styles.radioBtnText}>Kg</Text>
                            <RadioButton value={EWeightUnit.KG} />
                        </View>
                        <View style={styles.radioBtnContainer}>
                            <Text style={styles.radioBtnText}>Lb</Text>
                            <RadioButton value={EWeightUnit.LB} />
                        </View>
                    </View>
                </RadioButton.Group>
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
    radioBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioBtnText: {
        opacity: 0.7,
        fontSize: 12,
        fontStyle: 'italic',
    },
    menuTitle: {
        paddingLeft: 16,
        marginTop: 5,
    },
});
