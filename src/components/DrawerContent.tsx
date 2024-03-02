import { Drawer, Switch, TouchableRipple, Text } from 'react-native-paper';
import { useState } from 'react';
import { EScreens, RouterProps } from '../router';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { StyleSheet, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectDarkMode, setDarkMode } from '../features/preferences';

export default function DrawerContent({ navigation }: RouterProps) {
    const [activeScreen, setActiveScreen] = useState<EScreens>(EScreens.Home);
    
    const darkMode: boolean = useAppSelector(selectDarkMode);
    const dispatch = useAppDispatch();

    const onMenuItemClick = (screen: EScreens) => {
        setActiveScreen(screen);
        navigation.navigate(screen);
    };

    return (
        <DrawerContentScrollView {...navigation}>
            <Drawer.Section title="Menu">
                <Drawer.Item
                    label="Home"
                    active={activeScreen === EScreens.Home}
                    onPress={() => onMenuItemClick(EScreens.Home)}
                />
                <Drawer.Item
                    label="Workout"
                    active={activeScreen === EScreens.Workout}
                    onPress={() => onMenuItemClick(EScreens.Workout)}
                />
                <Drawer.Item
                    label="Program"
                    active={activeScreen === EScreens.Program}
                    onPress={() => onMenuItemClick(EScreens.Program)}
                />
            </Drawer.Section>
            <Drawer.Section title="Preferences">
                <TouchableRipple onPress={() => dispatch(setDarkMode(!darkMode))}>
                    <View style={styles.preference}>
                        <Text>Dark Theme</Text>
                        <View pointerEvents="none">
                            <Switch value={darkMode} />
                        </View>
                    </View>
                </TouchableRipple>
            </Drawer.Section>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});
