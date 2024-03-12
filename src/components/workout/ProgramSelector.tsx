import { StyleSheet } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';
import React from 'react';
import { Program } from '../../models/Program';
import ProgramViewer from '../shared/ProgramViewer';

export type ProgramSelectorProps = {
    programs: Realm.Results<Program>;
    visible: boolean;
    selectHandler: (program: Program) => void;
    hideHandler: () => void;
};

export default function ProgramSelector({
    programs,
    visible,
    selectHandler,
    hideHandler,
}: ProgramSelectorProps) {

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideHandler} style={{margin: 0}}>
                <Dialog.Title style={styles.confirmTitle}>
                    Choose your program
                </Dialog.Title>
                <Dialog.Content>
                    <ProgramViewer
                        programs={programs}
                        pressHandler={selectHandler}
                    />
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        maxHeight: 200,
        flexWrap: 'wrap',
    },
    confirmTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
});
