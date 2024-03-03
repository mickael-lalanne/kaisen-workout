import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { IconButton, Modal, Portal, TextInput } from 'react-native-paper';

export type ExerciseBuilderProps = {
    visible: boolean;
    hideBuilder: () => void;
};

export default function ExerciseBuilder({
    visible,
    hideBuilder,
}: ExerciseBuilderProps) {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const cancelExerciseCreation = (): void => {
        hideBuilder();
    };

    const saveExercise = (): void => {
        hideBuilder();
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={cancelExerciseCreation}
                contentContainerStyle={styles.addExerciseModal}
            >
                <TextInput
                    label="Exercise name"
                    value={name}
                    onChangeText={text => setName(text)}
                />

                <TextInput
                    label="Description"
                    multiline
                    numberOfLines={4}
                    value={description}
                    onChangeText={text => setDescription(text)}
                />

                <View style={styles.footerContainer}>
                    <IconButton
                        icon="cancel"
                        mode="outlined"
                        size={25}
                        style={{ width: 75 }}
                        onPress={cancelExerciseCreation}
                    />
                    <IconButton
                        icon="content-save-outline"
                        mode="contained"
                        size={25}
                        style={{ width: 75 }}
                        onPress={saveExercise}
                    />
                </View>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    addExerciseModal: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
    },
    footerContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignSelf: 'flex-end',
    },
});
