import { StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { Set } from '../../models/Program';
import SessionSetItem from './SessionSetItem';
import { useState } from 'react';

type SessionSetsListProps = {
    sets: Realm.List<Set>;
};

export default function SessionSetsList({ sets }: SessionSetsListProps) {
    const [activeSet, setActiveSet] = useState<Set | undefined>(undefined);

    const SetsList = (): React.JSX.Element[] => {
        const list: React.JSX.Element[] = [];

        sets.forEach((set, index) => {
            list.push(
                <SessionSetItem
                    set={set}
                    key={set._id.toString()}
                    active={activeSet?._id}
                    pressHandler={(set) => setActiveSet(set)}
                    longPressHandler={(set) => {}}
                />
            );
        });

        return list;
    };

    return <List.Section style={{ marginTop: 0 }}>{SetsList()}</List.Section>;
}

const styles = StyleSheet.create({});
