import { View, StyleSheet } from 'react-native';
import { HelperText, Portal, Text, TextInput } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { useAppTheme } from '../../app/theme';

type NumberInputProps = {
    value: string;
    changeHandler: (text: string) => void;
    label?: string;
    placeholder?: string;
    style?: object;
    inputStyle?: object;
    contentStyle?: object;
    alert?: boolean;
    dense?: boolean;
    noError?: boolean;
};

export default function NumberInput({
    value,
    changeHandler,
    label,
    placeholder,
    style,
    inputStyle,
    contentStyle,
    alert,
    dense,
    noError,
}: NumberInputProps) {
    const [localValue, setLocalValue] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const [endingWithDot, setEndingWithDot] = useState<boolean>(false);

    const theme = useAppTheme();

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const onChange = (text: string) => {
        // Check if reps number contains only digits and at most one dot
        let isNum = /^[0-9]*\.?[0-9]*$/.test(text);
        if (!isNum) {
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 2000);
        }

        // cf https://stackoverflow.com/a/55189615/22930358
        const textToDisplay: string = text
            // remove all characters other than digits and points
            .replace(/[^.\d]/g, '')
            // only allow one dot
            .replace(/^(\d*\.?)|(\d*)\.?/g, '$1$2');

        setEndingWithDot(textToDisplay.endsWith('.'));

        changeHandler(textToDisplay);
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
        } else if (!alert && !noError) {
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
                value={localValue + (endingWithDot ? '.' : '')}
                placeholder={placeholder}
                onChangeText={onChange}
                style={inputStyle}
                contentStyle={contentStyle}
                dense={dense}
                keyboardType="numeric"
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
