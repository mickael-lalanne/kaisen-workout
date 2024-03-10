import { View, StyleSheet } from 'react-native';
import { HelperText, Portal, Text, TextInput } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { useAppTheme } from '../../app/theme';

type NumberInputProps = {
    value: string;
    changeHandler: (text: string) => void;
    label: string;
    style?: object;
    inputStyle?: object;
    alert?: boolean;
};

export default function NumberInput({
    value,
    changeHandler,
    label,
    style,
    inputStyle,
    alert,
}: NumberInputProps) {
    const [localValue, setLocalValue] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    const theme = useAppTheme();

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const onChange = (text: string) => {
        // Check if reps number contains only digits
        let isNum = /^\d+$/.test(text);
        if (!isNum) {
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 2000);
        }

        changeHandler(text.replace(/[^0-9]/g, ''));
    };

    const Error = (): React.JSX.Element | undefined => {
        if (error && alert) {
            return (
                <Portal>
                    <View style={styles.alertContainer}>
                        <View
                            style={{
                                ...styles.alertContent,
                                backgroundColor: theme.colors.error,
                            }}
                        >
                            <Text
                                style={{
                                    ...styles.alertText,
                                    color: theme.colors.onError,
                                }}
                            >
                                Number only
                            </Text>
                        </View>
                    </View>
                </Portal>
            );
        } else if (!alert) {
            return (
                <HelperText type="error" visible={error}>
                    Number only
                </HelperText>
            );
        }
    };

    return (
        <View style={style}>
            <TextInput
                label={label}
                value={localValue}
                onChangeText={onChange}
                style={inputStyle}
            />
            {Error()}
        </View>
    );
}

const styles = StyleSheet.create({
    alertContainer: {
        position: 'absolute',
        top: 50,
        right: 0,
        left: 0,
        alignItems: 'center',
    },
    alertContent: {
        backgroundColor: 'yellow',
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 5,
    },
    alertText: {
        textAlign: 'center',
    },
});
