import { View, StyleSheet, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Dialog, Divider, IconButton, Portal, Switch, Text, TextInput, TouchableRipple } from 'react-native-paper';
import { BSON } from 'realm';
import { Exercise } from '../../models/Exercise';
import { ISet } from '../../models/Program';
import ExercicePicker from './ExercisePicker';
import { useQuery } from '@realm/react';
import { useAppTheme } from '../../app/theme';
import NumberInput from '../shared/NumberInput';

export type SetBuilderProps = {
    visible: boolean;
    saveHandler: (set: ISet) => void;
    hideBuilder: () => void;
    setsNumber: number;
    setToEdit?: ISet;
};

const DEFAULT_RECUP_DURATION: string = '90';
const DEFAULT_REPS_NUMBER: string = '4';

export default function SetBuilder({
    visible,
    saveHandler,
    hideBuilder,
    setsNumber,
    setToEdit,
}: SetBuilderProps) {
    const [id, setId] = useState<BSON.ObjectId>(new BSON.ObjectId());
    const [notes, setNotes] = useState<string>('');
    const [recupDuration, setRecupDuration] = useState<string>(DEFAULT_RECUP_DURATION);
    const [repsNumber, setRepsNumber] = useState<string>(DEFAULT_REPS_NUMBER);
    const [order, setOrder] = useState<number>(setsNumber);
    const [isSuperset, setIsSuperset] = useState<boolean>(false);
    const [exerciceIds, setExerciceIds] = useState<string[]>([]);
    const [exercisePickerVisible, setExercisePickerVisible] = useState<boolean>(false);

    // When isSuperset option goes back to false, keep only the first exercise 
    useEffect(() => {
        if (!isSuperset && exerciceIds.length > 0) {
            setExerciceIds([exerciceIds[0]]);
        }
    }, [isSuperset]);

    useEffect(() => {
        setOrder(setsNumber);
    }, [setsNumber]);

    useEffect(() => {
        if (setToEdit) {
            setId(setToEdit._id);
            setOrder(setToEdit.order);
            setNotes(setToEdit.notes);
            setRecupDuration(setToEdit.recupDuration.toString());
            setRepsNumber(setToEdit.repsNumber.toString());
            setExerciceIds(setToEdit.exerciceIds);
        }
    }, [setToEdit]);

    const exercises = useQuery(Exercise);
    const theme = useAppTheme();

    const cancelSetCreation = (): void => {
        _resetState();
        hideBuilder();
    };

    const addExercise = (exercise: Exercise) => {
        setExerciceIds(exerciceIds.concat(exercise._id.toString()));
        setExercisePickerVisible(false);
    };

    const deleteExercise = (exerciseId: BSON.ObjectId) => {
        setExerciceIds([...exerciceIds.filter(e => e !== exerciseId.toString())]);
    };

    const saveSet = (): void => {
        const setToAdd: ISet = {
            _id: id,
            notes,
            recupDuration: Number(recupDuration),
            repsNumber: Number(repsNumber),
            order,
            exerciceIds
        };
        saveHandler(setToAdd);
        _resetState();
        hideBuilder();
    };

    const _resetState = (): void => {
        setId(new BSON.ObjectId());
        setNotes('');
        setRecupDuration(DEFAULT_RECUP_DURATION);
        setRepsNumber(DEFAULT_REPS_NUMBER);
        setExerciceIds([]);
    };

    const ExercisesViewer = (): React.JSX.Element[] => {
        const exercisesElements: React.JSX.Element[] = [];
    
        exerciceIds.forEach((eId, i) => {
            const exercise: Exercise | undefined = exercises.find(e => e._id.toString() === eId.toString());

            const ExerciseDescription = (): React.JSX.Element | undefined => {
                if (exercise?.description) {
                    return <Text numberOfLines={2} style={{ fontSize: 10, fontStyle: 'italic' }}>
                        {exercise.description}
                    </Text>;
                }
            };

            if (exercise) {
                exercisesElements.push(
                    <View
                        style={{
                            ...styles.exerciseContainer,
                            borderColor: theme.colors.onSurface
                        }}
                        key={i}
                    >
                       <Image
                            style={styles.exerciseImage}
                            source={{ uri: exercise.image }}
                        ></Image>
                        <View style={styles.exerciseContent}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>
                                {exercise.name}
                            </Text>
                            {ExerciseDescription()}
                        </View>
                        <IconButton
                            style={styles.exerciseDeleteBtn}
                            icon="close"
                            size={20}
                            onPress={() => deleteExercise(exercise._id)}
                        />
                    </View>
                );
            }
        });

        return exercisesElements;
    };

    const ChooseExerciseButton = (): React.JSX.Element | undefined => {
        if (!exerciceIds.length || isSuperset) {
            return <TouchableRipple
                style={{
                    ...styles.exerciseContainer,
                    marginTop: 20,
                    borderWidth: 1,
                    borderColor: theme.colors.primary,
                    justifyContent: 'center',
                }}
                onPress={() => setExercisePickerVisible(true)}
            >
                <Text style={{ color: theme.colors.primary }}>
                    {exerciceIds.length > 0 && isSuperset ? 'Choose another exercise' : 'Choose an exercise' }
                </Text>
            </TouchableRipple>;
        }
    }

    const isDisabled = exerciceIds.length === 0 || !recupDuration || !repsNumber;

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={cancelSetCreation}>
                <View style={{ flexDirection: 'row', marginBottom: 5, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Dialog.Title style={styles.confirmTitle}>NEW SET</Dialog.Title>
                        <TouchableRipple onPress={() => setIsSuperset(!isSuperset)}>
                            <View style={styles.preference}>
                                <Text>Superset</Text>
                                <View pointerEvents="none">
                                    <Switch value={isSuperset} />
                                </View>
                            </View>
                        </TouchableRipple>
                </View>
                <Dialog.Content>
                    <ScrollView style={{ maxHeight: 200, marginTop: -20 }}>
                        {ExercisesViewer()}
                    </ScrollView>

                    {ChooseExerciseButton()}

                    <TextInput
                        label="Notes"
                        multiline
                        numberOfLines={4}
                        value={notes}
                        onChangeText={(text) => setNotes(text)}
                        style={{ marginTop: 20 }}
                    />
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <NumberInput
                            label="Reps number"
                            value={repsNumber}
                            changeHandler={(value) => setRepsNumber(value)}
                            style={{ flex: 1, marginRight: 2.5 }}
                        />
                        <NumberInput
                            label="Recup duration (s)"
                            value={recupDuration}
                            changeHandler={(value) => setRecupDuration(value)}
                            style={{ flex: 1.3, marginLeft: 2.5 }}
                            inputStyle={{ minWidth: 20 }}
                        />
                    </View>
                    <ExercicePicker
                        visible={exercisePickerVisible}
                        addExercise={addExercise}
                        hidePicker={() => setExercisePickerVisible(false)}
                    />

                    <Divider />
                </Dialog.Content>

                <Dialog.Actions style={{ marginTop: -15 }}>
                    <IconButton
                        icon="cancel"
                        mode="outlined"
                        size={25}
                        style={{ width: 75 }}
                        onPress={cancelSetCreation}
                    />
                    <IconButton
                        icon="content-save-outline"
                        mode="contained"
                        size={25}
                        style={{ width: 75, opacity: isDisabled ? 0.2 : 1,}}
                        onPress={saveSet}
                        disabled={isDisabled}
                    />
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const EXERCICE_HEIGHT: number = 75;

const styles = StyleSheet.create({
    exercisesBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    exerciseContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 0.5,
        borderRadius: 10,
        height: EXERCICE_HEIGHT,
        marginTop: 20
    },
    exerciseContent: {
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        paddingRight: 40,
        paddingLeft: 10
    },
    exerciseImage: {
        height: EXERCICE_HEIGHT - 1,
        width: EXERCICE_HEIGHT - 1,
        objectFit: 'cover',
        borderRadius: 10,
    },
    exerciseDeleteBtn: {
        position: 'absolute',
        top: -10,
        right: -10
    },
    confirmTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        marginVertical: 5,
        fontWeight: 'bold'
    },
    exerciseButton: {
        width: 55,
        height: 55,
        borderRadius: 5,
        marginRight: 0,
    },
    // TODO: make custom AppSwitch component
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: 10
    },
});
