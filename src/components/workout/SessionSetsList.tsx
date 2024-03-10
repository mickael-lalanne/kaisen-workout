import { StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { Set } from '../../models/Program';
import SessionSetItem from './SessionSetItem';
import { useAppDispatch } from '../../app/hooks';
import { setActiveSet } from '../../features/currentSession';

type SessionSetsListProps = {
    sets: Realm.List<Set>;
};

export default function SessionSetsList({ sets }: SessionSetsListProps) {
    const dispatch = useAppDispatch();

    const SetsList = (): React.JSX.Element[] => {
        const list: React.JSX.Element[] = [];

        sets.forEach((set) => {
            list.push(
                <SessionSetItem
                    set={set}
                    key={set._id.toString()}
                    pressHandler={(set) => dispatch(setActiveSet(set._id.toString()))}
                    longPressHandler={(set) => {}}
                />
            );
        });

        return list;
    };

    return <List.Section style={{ marginTop: 0 }}>{SetsList()}</List.Section>;
}

const styles = StyleSheet.create({});
