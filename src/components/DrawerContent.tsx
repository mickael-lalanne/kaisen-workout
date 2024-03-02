import { Drawer } from 'react-native-paper';
import { useState } from 'react';
import { EScreens, RouterProps } from '../router';

export default function DrawerContent({ navigation }: RouterProps) {
    const [active, setActive] = useState<EScreens>(EScreens.Home);

    const onMenuItemClick = (screen: EScreens) => {
        setActive(screen);
        navigation.navigate(screen);
    };

    return (
        <Drawer.Section title="MENU">
            <Drawer.Item
                label="Home"
                active={active === EScreens.Home}
                onPress={() => onMenuItemClick(EScreens.Home)}
            />
            <Drawer.Item
                label="Workout"
                active={active === EScreens.Workout}
                onPress={() => onMenuItemClick(EScreens.Workout)}
            />
            <Drawer.Item
                label="Program"
                active={active === EScreens.Program}
                onPress={() => onMenuItemClick(EScreens.Program)}
            />
        </Drawer.Section>
    );
}
