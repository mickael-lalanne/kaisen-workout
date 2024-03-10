import { StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { Set } from '../../models/Program';
import SessionSetItem from './SessionSetItem';

type SessionSetsListProps = {
    sets: Realm.List<Set>;
};

export default function SessionSetsList({ sets }: SessionSetsListProps) {
    const SetsList = (): React.JSX.Element[] => {
        const list: React.JSX.Element[] = [];

        sets.forEach((set, index) => {
            list.push(<SessionSetItem set={set} key={set._id.toString()} />);
        });

        return list;
    };

    return <List.Section>{SetsList()}</List.Section>;
}

const styles = StyleSheet.create({});
