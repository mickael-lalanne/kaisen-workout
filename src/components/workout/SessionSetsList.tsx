import { StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { Set } from '../../models/Program';
import SessionSetItem from './SessionSetItem';
import { ESessionState, Session } from '../../models/Session';
import { useQuery } from '@realm/react';

type SessionSetsListProps = {
    sets: Realm.List<Set>;
};

export default function SessionSetsList({ sets }: SessionSetsListProps) {
    // TODO : duplicate code (store session id in store ?)
    const session: Session | undefined = useQuery(Session, (collection) =>
        collection
            .sorted('date')
            .filtered('state == $0', ESessionState.InProgress)
    ).at(0);

    const SetsList = (): React.JSX.Element[] => {
        const list: React.JSX.Element[] = [];

        if (session) {
            session.sets.forEach((set) => {
                list.push(<SessionSetItem sessionSet={set} key={set._id.toString()} />);
            });
        }

        return list;
    };

    return <List.Section style={{ marginTop: 0 }}>{SetsList()}</List.Section>;
}

const styles = StyleSheet.create({});
