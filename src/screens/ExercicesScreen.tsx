import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import React, { useState } from 'react';
import { useQuery, useRealm } from '@realm/react';
import { useAppTheme } from '../app/theme';
import { Exercise } from '../models/Exercise';
import { Program, Set } from '../models/Program';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import ExerciseViewer from '../components/program/ExerciseViewer';
import ExerciseBuilder from '../components/program/ExerciseBuilder';

export default function ExerciseScreen() {
    const [exerciseToDelete, setExerciseToDelete] = useState<Exercise>();
    const [exerciseToEdit, setExerciseToEdit] = useState<Exercise>();
    const [builderVisible, setBuilderVisible] = useState<boolean>(false);

    const programs = useQuery(Program);
    const exercises = useQuery(Exercise);
    const theme = useAppTheme();
    const realm = useRealm();

    const saveHandler = (): void => {
        setExerciseToEdit(undefined);
        setBuilderVisible(false);
    };

    const deleteExercise = (): void => {
        if (exerciseToDelete) {
            // First, we remove the exercise from every program using it in a set
            realm.write(() => {
                programs.forEach((p: Program) => {
                    const setWithExercise: Set[] = p.sets.filter((p) =>
                        p.exerciceIds.includes(exerciseToDelete._id.toString())
                    );
                    setWithExercise.forEach((s: Set) => {
                        realm.delete(s);
                    });
                });
            });
            // Then we delete the exercise
            realm.write(() => {
                realm.delete(exerciseToDelete);
            });
            setExerciseToDelete(undefined);
        }
    };

    const hideBuilder = (): void => {
        setBuilderVisible(false);
        setExerciseToEdit(undefined);
    };

    const Subtitle = (): React.JSX.Element => {
        if (exercises.length === 0) {
            return (
                <Text style={styles.noExerciseText}>
                    Well...{'\n'}
                    It's a little bit embarassing...{'\n'}
                    It seems you don't have any exercise yet...
                </Text>
            );
        } else {
            return (
                <Text style={styles.subtitle}>
                    Press an exercise to edit it, long press to delete it !
                </Text>
            );
        }
    };

    const NoExerciseMessage = (): React.JSX.Element | undefined => {
        if (exercises.length === 0) {
            return (
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={require('../assets/well.jpg')}
                        resizeMode="contain"
                        style={styles.noExerciseImage}
                    />
                </View>
            );
        }
    };

    return (
        <View
            style={{
                ...styles.viewContainer,
                backgroundColor: theme.colors.surface,
            }}
        >
            {Subtitle()}

            <View
                style={{
                    ...styles.viewerContainer,
                    backgroundColor: theme.colors.elevation.level5,
                }}
            >
                {NoExerciseMessage()}
                <ExerciseViewer
                    pressHandler={(e: Exercise) => setExerciseToEdit(e)}
                    longPressHandler={(e: Exercise) => setExerciseToDelete(e)}
                />
            </View>

            <View style={{ flexGrow: 1 }}></View>

            <IconButton
                icon="plus"
                size={50}
                onPress={() => setBuilderVisible(true)}
                mode="contained"
                style={styles.addBtn}
            />

            <ConfirmDialog
                visible={!!exerciseToDelete}
                title={`⚠️ Delete the exercise ${exerciseToDelete?.name} ?`}
                content="Be carefull. Deleting the exercise will also remove all sets using it in every program."
                confirmHandler={deleteExercise}
                cancelHandler={() => setExerciseToDelete(undefined)}
            />

            <ExerciseBuilder
                visible={builderVisible || !!exerciseToEdit}
                exerciseToEdit={exerciseToEdit}
                saveHandler={saveHandler}
                hideBuilder={hideBuilder}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        padding: 20,
    },
    subtitle: {
        fontStyle: 'italic',
        fontSize: 12,
        marginBottom: 10,
    },
    viewerContainer: {
        padding: 10,
        borderRadius: 15,
        maxHeight: Dimensions.get('window').height - 280,
    },
    addBtn: {
        width: '100%',
        borderRadius: 5,
        marginHorizontal: 0,
        marginVertical: 0,
    },
    noExerciseText: {
        marginBottom: 10,
        fontStyle: 'italic',
        fontSize: 10,
    },
    noExerciseImage: {
        maxWidth: '100%',
        height: 150,
        aspectRatio: 16 / 9,
        objectFit: 'cover',
        borderRadius: 10,
    },
});
