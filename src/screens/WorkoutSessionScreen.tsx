import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '../app/theme';
import { Text } from 'react-native-paper';
import { useObject, useQuery } from '@realm/react';
import { Session } from '../models/Session';
import { Program } from '../models/Program';

export default function WorkoutSessionScreen() {
    const session: Session = useQuery(
        Session,
        collection => collection.sorted('date').filtered('inProgress == true'),
      ).at(0)!;

    const program = useObject(Program, session.programId);

    const theme = useAppTheme();

    return (
        <View
            style={{
                ...styles.viewContainer,
                backgroundColor: theme.colors.surface,
            }}
        >
            <Text>Session screen</Text>
            <Text>{program?.name}</Text>
            <Text>{program?._id.toString()}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
});
