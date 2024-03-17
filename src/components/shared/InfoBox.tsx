import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import React from 'react';
import { useAppTheme } from '../../app/theme';

export type InfoBoxProps = {
    text: string;
    style: any;
};

export default function InfoBox({ text, style }: InfoBoxProps) {
    const theme = useAppTheme();

    return (
        <View
            style={{
                ...style,
                ...styles.container,
                backgroundColor: theme.colors.tertiary,
            }}
        >
            <Icon source="information-outline" size={30} color={theme.colors.onTertiary} />
            <Text style={{...styles.text, color: theme.colors.onTertiary}}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    text: {
        fontStyle: 'italic',
    }
});
