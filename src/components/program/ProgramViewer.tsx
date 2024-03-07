import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import React from 'react';
import { Program } from '../../models/Program';

export type ProgramViewerProps = {
    programs: Realm.Results<Program>;
};

export default function ProgramViewer({ programs }: ProgramViewerProps) {

    const ProgramList = (): React.JSX.Element[] => {
        const programElements: React.JSX.Element[] = [];

        programs.forEach((p: Program) => {
            programElements.push(
                <View key={p._id.toString()}>
                    <Text>{p.name}</Text>
                </View>
            );
        });

        return programElements;
    };

    return (
        <View style={styles.programsContainer}>
            {ProgramList()}
        </View>
    );
}

const styles = StyleSheet.create({
    programsContainer: {
    },
});
