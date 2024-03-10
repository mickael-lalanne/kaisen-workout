import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '../app/theme';
import { useObject, useQuery } from '@realm/react';
import { ESessionState, Session } from '../models/Session';
import { Program } from '../models/Program';
import SessionSetsList from '../components/workout/SessionSetsList';
import RestTimer from '../components/workout/RestTimer';

export default function WorkoutSessionScreen() {
    const session: Session = useQuery(Session, (collection) =>
        collection.sorted('date').filtered('state == $0', ESessionState.InProgress)
    ).at(0)!;

    const program = useObject(Program, session.programId);

    const theme = useAppTheme();

    const SetsList = (): React.JSX.Element | undefined => {
        if (program && program.sets) {
            return <SessionSetsList sets={program.sets} />;
        }
    };

    return (
        <View
            style={{
                ...styles.viewContainer,
                backgroundColor: theme.colors.surface,
            }}
        >
            {SetsList()}

            <View style={{ flex: 1 }}></View>

            <RestTimer />
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
});
