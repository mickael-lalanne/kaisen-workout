import { StyleSheet } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';
import React from 'react';
import { Program } from '../../models/Program';
import ProgramViewer from '../shared/ProgramViewer';
import { EScreens, RouterProps } from '../../app/router';
import { useRealm } from '@realm/react';
import { ESessionState, Session } from '../../models/Session';

export type ProgramSelectorProps = {
    programs: Realm.Results<Program>;
    visible: boolean;
    hideHandler: () => void;
    navigation: RouterProps['navigation'];
};

export default function ProgramSelector({
    programs,
    visible,
    hideHandler,
    navigation
}: ProgramSelectorProps) {
    const realm = useRealm();

    const selectProgram = (program: Program) => {
        realm.write(() => {
            realm.create(Session, {
                programId: program._id,
                date: new Date(),
                state: ESessionState.InProgress,
            });
        });

        navigation.navigate(EScreens.WorkoutSession);
        hideHandler();
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideHandler} style={{margin: 0}}>
                <Dialog.Title style={styles.confirmTitle}>
                    Choose your program
                </Dialog.Title>
                <Dialog.Content>
                    <ProgramViewer
                        programs={programs}
                        pressHandler={selectProgram}
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
