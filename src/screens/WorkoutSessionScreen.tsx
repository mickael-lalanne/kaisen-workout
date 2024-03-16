import { View, StyleSheet, ScrollView } from 'react-native';
import { useAppTheme } from '../app/theme';
import { useObject } from '@realm/react';
import { Session } from '../models/Session';
import RestTimer from '../components/workout/RestTimer';
import { selectCurrentSessionId } from '../features/currentSession';
import { useAppSelector } from '../app/hooks';
import { List } from 'react-native-paper';
import { BSON } from 'realm';
import SessionSetItem from '../components/workout/SessionSetItem';
import AddSessionSetButton from '../components/workout/AddSessionSetButton';

export default function WorkoutSessionScreen() {
    const theme = useAppTheme();
    const currentSessionId: string | undefined = useAppSelector(
        selectCurrentSessionId
    );

    const session: Session | null = useObject(
        Session,
        new BSON.ObjectId(currentSessionId)
    );

    const SetsList = (): React.JSX.Element[] => {
        const list: React.JSX.Element[] = [];

        if (session) {
            session.sets.forEach((set) => {
                list.push(
                    <SessionSetItem sessionSet={set} key={set._id.toString()} />
                );
            });
        }

        return list;
    };

    return (
        <View
            style={{
                ...styles.viewContainer,
                backgroundColor: theme.colors.surface,
            }}
        >
            <ScrollView>
                <List.Section style={{ marginVertical: 0 }}>
                    {SetsList()}
                </List.Section>
            </ScrollView>

            <AddSessionSetButton />

            <RestTimer />
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
});
