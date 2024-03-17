import { View, StyleSheet, Image, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Dialog, IconButton, Portal, TextInput } from 'react-native-paper';
import {
    ImagePickerResponse,
    launchImageLibrary,
} from 'react-native-image-picker';
import { BSON } from 'realm';
import { useRealm } from '@realm/react';
import { Exercise } from '../../models/Exercise';

export type ExerciseBuilderProps = {
    visible: boolean;
    hideBuilder: () => void;
    saveHandler: (exercose: Exercise) => void;
    exerciseToEdit?: Exercise;
};

export default function ExerciseBuilder({
    visible,
    hideBuilder,
    saveHandler,
    exerciseToEdit
}: ExerciseBuilderProps) {
    const [id, setId] = useState<BSON.ObjectId>(new BSON.ObjectId());
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [image, setImage] = useState<string>();

    const realm = useRealm();

    useEffect(() => {
        if (exerciseToEdit) {
            setId(exerciseToEdit._id);
            setName(exerciseToEdit.name);
            setDescription(exerciseToEdit.description);
            setImage(exerciseToEdit.image);
        }
    }, [exerciseToEdit]);

    const cancelExerciseCreation = (): void => {
        setId(new BSON.ObjectId());
        setName('');
        setDescription('');
        setImage(undefined);
        hideBuilder();
    };

    const saveExercise = (): void => {
        realm.write(() => {
            const savedExercise: Exercise = realm.create(Exercise, {
                _id: id,
                name,
                description,
                image,
            }, exerciseToEdit ? Realm.UpdateMode.Modified : undefined);
            saveHandler(savedExercise);
        });
        hideBuilder();
    };

    const selectImage = async (): Promise<void> => {
        const result: ImagePickerResponse = await launchImageLibrary({
            mediaType: 'photo',
            maxWidth: 150,
            maxHeight: 150,
            includeBase64: true,
        });

        setImage('data:image/png;base64,' + result.assets![0].base64);
    };

    const ExerciseImage = (): React.JSX.Element => {
        if (image) {
            return (
                <Pressable onPress={selectImage}>
                    <Image
                        style={{
                            ...styles.imageButton,
                            marginLeft: 5,
                            objectFit: 'cover',
                            marginVertical: 6,
                        }}
                        source={{ uri: image }}
                    ></Image>
                </Pressable>
            );
        } else {
            return (
                <IconButton
                    icon="file-image-plus-outline"
                    mode="outlined"
                    size={25}
                    style={styles.imageButton}
                    onPress={selectImage}
                />
            );
        }
    };

    const isDisabled: boolean = !name || !image;

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={cancelExerciseCreation}>
                <Dialog.Title style={styles.confirmTitle}>
                    { exerciseToEdit ? 'Edit' : 'Add'} an exercise
                </Dialog.Title>
                <Dialog.Content>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        <TextInput
                            style={{ flexGrow: 1 }}
                            label="Name"
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                        {ExerciseImage()}
                    </View>
                    <TextInput
                        label="Description"
                        multiline
                        numberOfLines={4}
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                    />
                </Dialog.Content>

                <Dialog.Actions style={{ marginTop: 0 }}>
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
                        style={{ width: 75, opacity: isDisabled ? 0.5 : 1 }}
                        onPress={saveExercise}
                        disabled={isDisabled}
                    />
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const styles = StyleSheet.create({
    confirmTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    imageButton: {
        width: 55,
        height: 55,
        borderRadius: 5,
        marginRight: 0,
    },
});
