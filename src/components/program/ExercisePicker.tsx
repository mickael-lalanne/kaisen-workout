import { StyleSheet, View } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';
import { Exercise } from '../../models/Exercise';
import ExerciseBuilder from './ExerciseBuilder';
import { useState } from 'react';
import ExerciseViewer from './ExerciseViewer';

export type ExercisePickerProps = {
    visible: boolean;
    addExercise: (exercise: Exercise) => void;
    hidePicker: () => void;
};

export default function ExercicePicker({
    visible,
    addExercise,
    hidePicker,
}: ExercisePickerProps) {
    const [exerciseBuilderVisible, setExerciseBuilderVisible] =
        useState<boolean>(false);

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hidePicker}>
                <Dialog.Title style={styles.confirmTitle}>
                    Choose an exercise
                </Dialog.Title>
                <Dialog.Content>
                    <View style={{ maxHeight: 200 }}>
                        <ExerciseViewer
                            pressHandler={(e) => addExercise(e)}
                            addHandler={() => setExerciseBuilderVisible(true)}
                        />
                    </View>

                    <ExerciseBuilder
                        visible={exerciseBuilderVisible}
                        hideBuilder={() => setExerciseBuilderVisible(false)}
                        saveHandler={(e) => addExercise(e)}
                    ></ExerciseBuilder>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
}

const styles = StyleSheet.create({
    confirmTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
