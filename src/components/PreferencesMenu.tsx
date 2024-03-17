import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    Appbar,
    Menu,
    RadioButton,
    Switch,
    Text,
    TouchableRipple,
} from 'react-native-paper';

import { useQuery, useRealm } from '@realm/react';
import { EThemeColor, EWeightUnit, Preferences } from '../models/Preferences';
import { PREFERENCES_THEMES, useAppTheme } from '../app/theme';

export default function PreferencesMenu() {
    const [visible, setVisible] = useState<boolean>(false);
    const realm = useRealm();
    const theme = useAppTheme();

    const preferences: Preferences | undefined = useQuery(
        Preferences,
        (collection) => collection
    ).at(0);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

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

    const setTheme = (theme: EThemeColor) => {
        realm.write(() => {
            if (preferences) {
                preferences.theme = theme;
            }
        });
    };

    const ThemeColors = (): React.JSX.Element[] => {
        const colors: React.JSX.Element[] = [];

        PREFERENCES_THEMES.forEach((themeObject) => {
            const backgroundColor: string =
                preferences && preferences.darkMode
                    ? themeObject.lightPrimary
                    : themeObject.darkPrimary;
            colors.push(
                <TouchableRipple
                    key={themeObject.color}
                    style={{ padding: 7 }}
                    onPress={() => setTheme(themeObject.color)}
                >
                    <View
                        style={{ ...styles.colorBlock, backgroundColor }}
                    >
                    <View
                        style={
                            preferences?.theme === themeObject.color
                                ? {...styles.colorBlockSelected, borderColor: theme.colors.inverseSurface}
                                : undefined
                        }
                    ></View>

                    </View>
                </TouchableRipple>
            );
        });

        return colors;
    };

    return (
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
                <View style={styles.darkModeContainer}>
                    <Text>Dark mode</Text>
                    <View pointerEvents="none">
                        <Switch value={preferences?.darkMode} />
                    </View>
                </View>
            </TouchableRipple>

            <Text style={styles.menuTitle}>Theme</Text>
            <View style={styles.colorsContainer}>{ThemeColors()}</View>

            <Text style={styles.menuTitle}>Weight unit</Text>
            <RadioButton.Group
                onValueChange={(value) => setWeightUnit(value as EWeightUnit)}
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
    );
}

const BORDER_COLOR_RADIUS: number = 5;
const styles = StyleSheet.create({
    darkModeContainer: {
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
    colorsContainer: {
        flexDirection: 'row',
        paddingLeft: 15,
        gap: 5,
        paddingTop: 5,
    },
    colorBlock: {
        borderRadius: BORDER_COLOR_RADIUS,
        height: 25,
        width: 25,
    },
    colorBlockSelected: {
        position: 'absolute',
        borderRadius: BORDER_COLOR_RADIUS,
        width: '100%',
        height: '100%',
        bottom: 0,
        borderWidth: 1,
    }
});
