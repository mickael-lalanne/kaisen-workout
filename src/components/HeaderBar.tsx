import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    Appbar,
    Menu,
    Switch,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectDarkMode, setDarkMode } from '../features/preferences';
import {
    getFocusedRouteNameFromRoute,
    useRoute,
} from '@react-navigation/native';
import { EScreens, RouterProps } from '../app/router';

interface HeaderBarProps {
    navigation: RouterProps['navigation'];
}

export default function HeaderBar({ navigation }: HeaderBarProps) {
    const [visible, setVisible] = useState<boolean>(false);

    const darkMode: boolean = useAppSelector(selectDarkMode);
    const dispatch = useAppDispatch();
    const route = useRoute();
    const theme = useTheme();

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const _getTitle = (): string => {
        const routeName: EScreens = _getRouteName();

        switch (routeName) {
            case EScreens.Workout:
                return '⚔️  Perform like Toji';
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

    const _getRouteName = (): EScreens => {
        return (getFocusedRouteNameFromRoute(route) ?? route.name) as EScreens;
    };

    const GoBackIcon = (): React.JSX.Element | undefined => {
        const routeName: EScreens = _getRouteName();

        const showBackIcon =
            routeName === EScreens.ProgramBuilder ||
            routeName === EScreens.Exercises;

        if (showBackIcon) {
            return <Appbar.BackAction onPress={() => navigation.goBack()} />;
        }
    };

    return (
        <Appbar.Header
            style={{ backgroundColor: theme.colors.secondaryContainer }}
        >
            {GoBackIcon()}
            <Appbar.Content
                title={_getTitle()}
                titleStyle={{ fontSize: 17, fontWeight: 'bold' }}
            />
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
