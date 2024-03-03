import { View, StyleSheet, Image, Pressable } from 'react-native';
import React, { useState } from 'react';
import { IconButton, Modal, Portal, TextInput } from 'react-native-paper';
import {
    ImagePickerResponse,
    launchImageLibrary,
} from 'react-native-image-picker';
import { BSON } from 'realm';
import { useRealm } from '@realm/react';
import { Exercise } from '../models/Exercise';

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
    const [image, setImage] = useState<string>();

    const realm = useRealm();

    const cancelExerciseCreation = (): void => {
        setName('');
        setDescription('');
        setImage(undefined);
        hideBuilder();
    };

    const saveExercise = (): void => {
        realm.write(() => {
            realm.create(Exercise, {
                _id: new BSON.ObjectId(),
                name,
                description,
                image
            });
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

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={cancelExerciseCreation}
                contentContainerStyle={styles.addExerciseModal}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        style={{ flexGrow: 1 }}
                        label="Exercise name"
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
                        disabled={!name || !image}
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
        borderRadius: 20,
    },
    imageButton: {
        width: 55,
        height: 55,
        borderRadius: 5,
        marginRight: 0,
    },
    footerContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignSelf: 'flex-end',
    },
});
