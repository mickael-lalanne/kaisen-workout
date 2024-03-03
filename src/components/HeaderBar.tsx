import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Menu, Switch, Text, TouchableRipple } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectDarkMode, setDarkMode } from '../features/preferences';
import { useRoute } from '@react-navigation/native';
import { EScreens } from '../app/router';

export default function HeaderBar() {
    const [visible, setVisible] = useState<boolean>(false);

    const darkMode: boolean = useAppSelector(selectDarkMode);
    const dispatch = useAppDispatch();
    const route = useRoute();

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const _getTitle = (): string => {
        switch (route.name) {
            case EScreens.Workout:
                return 'Perform like Toji';
            case EScreens.Progression:
                return 'Analyze like Nanami';
            case EScreens.Program:
            default:
                return 'Become as strong as Gojo';
        }
    };

    return (
        <Appbar.Header>
            {/* <Appbar.BackAction onPress={_goBack} /> */}
            <Appbar.Content title={_getTitle()} titleStyle={{fontSize: 17, fontStyle: 'italic'}} />
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
                <TouchableRipple onPress={() => dispatch(setDarkMode(!darkMode))}>
                    <View style={styles.preference}>
                        <Text>Dark Theme</Text>
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
