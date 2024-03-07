import { useQuery, useRealm } from '@realm/react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Exercise } from '../../models/Exercise';
import { useState } from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

export default function ExerciseViewer() {
    const [exerciseToDelete, setExerciseToDelete] = useState<Exercise>();

    const exercises = useQuery(Exercise);
    const realm = useRealm();

    const deleteExercise = (): void => {
        realm.write(() => {
            realm.delete(exerciseToDelete);
        });
        setExerciseToDelete(undefined);
    };

    const ExercisesList = (): React.JSX.Element[] => {
        const exercicesList: React.JSX.Element[] = [];
        exercises.forEach((e) => {
            exercicesList.push(
                <Pressable
                    onPress={() => setExerciseToDelete(e)}
                    key={e._id.toString()}
                >
                    <Image
                        style={styles.exerciseImage}
                        source={{ uri: e.image }}
                    ></Image>
                </Pressable>
            );
        });

        return exercicesList;
    };

    return (
        <>
            <ScrollView style={{ flexDirection: 'row' }} horizontal>
                {ExercisesList()}
            </ScrollView>

            <Portal>
                <Dialog
                    visible={!!exerciseToDelete}
                    onDismiss={() => setExerciseToDelete(undefined)}
                >
                    <Dialog.Title style={styles.confirmTitle}>
                        Delete the exercise ‛ {exerciseToDelete?.name} ’ ?
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">
                            Deleting this exercise will also deletes it from all
                            programs using it.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            onPress={() => setExerciseToDelete(undefined)}
                            mode="contained"
                            style={styles.confirmButton}
                        >
                            Cancel
                        </Button>
                        <Button
                            onPress={() => deleteExercise()}
                            mode="outlined"
                            style={styles.confirmButton}
                        >
                            Delete
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    confirmTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    confirmButton: {
        width: 70,
    },
    exerciseImage: {
        height: 75,
        width: 75,
        objectFit: 'cover',
        marginHorizontal: 6,
        borderRadius: 10
    },
});
