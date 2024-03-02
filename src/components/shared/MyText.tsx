import { StyleSheet, Text } from 'react-native';

type MyTextProps = {
    text: string;
};

export default function MyText(props: MyTextProps) {
    return (
        <Text style={styles.text}>
            {props.text} !!
        </Text>
    );
}

const styles = StyleSheet.create({
    text: {
    },
});
