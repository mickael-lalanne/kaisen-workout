import { View, StyleSheet, Pressable, Image } from 'react-native';
import { BSON } from 'realm';
import { useRealm } from '@realm/react';
import React, { useState } from 'react';
import { Button, Icon, IconButton, Text, TextInput } from 'react-native-paper';
import { Program, Set } from '../models/Program';
import SetBuilder from '../components/SetBuilder';
import SetViewer from '../components/SetViewer';
import {
    ImagePickerResponse,
    launchImageLibrary,
} from 'react-native-image-picker';
import { EScreens, RouterProps } from '../app/router';

export default function ProgramBuilderScreen({ navigation }: RouterProps) {
    const realm = useRealm();
    const [programName, setProgramName] = useState<string>('');
    const [programDescription, setProgramDescription] = useState<string>('');
    const [programImage, setProgramImage] = useState<string>('');
    const [programSets, setProgramSets] = useState<Set[]>([]);
    const [showSetBuilder, setShowSetBuilder] = useState<boolean>(false);

    /**
     * Add a program to the local database
     */
    const addProgram = (): void => {
        realm.write(() => {
            realm.create(Program, {
                name: programName,
                description: programDescription,
                image: programImage,
                sets: programSets,
            });
            navigation.navigate(EScreens.ProgramHome)
        });
    };

    const addSet = (setToAdd: Set): void => {
        setProgramSets(programSets.concat(setToAdd));
    };

    const deleteSet = (setId: BSON.ObjectId): void => {
        const newSetsList: Set[] = programSets.filter((s) => s._id !== setId);
        const newOrderedSetsList: Set[] = newSetsList.map((s, i) => {
            return { ...s, order: i };
        });

        setProgramSets(newOrderedSetsList);
    };

    // TODO : shared with ExerciseBuilder
    const selectImage = async (): Promise<void> => {
        const result: ImagePickerResponse = await launchImageLibrary({
            mediaType: 'photo',
            maxWidth: 300,
            maxHeight: 300,
            includeBase64: true,
        });

        setProgramImage('data:image/png;base64,' + result.assets![0].base64);
    };

    const ProgramImage = (): React.JSX.Element => {
        if (programImage) {
            return (
                <Pressable onPress={selectImage}>
                    <Image
                        style={{
                            ...styles.imageButton,
                            objectFit: 'cover',
                        }}
                        source={{ uri: programImage }}
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

    const NoSetMessage = (): React.JSX.Element | undefined => {
        if (programSets.length === 0) {
            return (
                <View style={styles.noSetMessageContainer}>
                    <Text style={styles.noSetMessageText}>
                        No set yet. {"\n"}
                        Start adding exercises by clicking there.
                    </Text>
                    <Icon source="arrow-up-right" size={20} />
                </View>
            );
        };
    };

    return (
        <View style={styles.viewContainer}>
            <TextInput
                label="Program Name"
                value={programName}
                onChangeText={(text) => setProgramName(text)}
                style={{ marginBottom: 5 }}
            />

            <View style={{ flexDirection: 'row' }}>
                <TextInput
                    label="Description"
                    style={{ flexGrow: 1, marginRight: 5 }}
                    contentStyle={{ height: 100 }}
                    multiline
                    numberOfLines={4}
                    value={programDescription}
                    onChangeText={(text) => setProgramDescription(text)}
                />
                {ProgramImage()}
            </View>

            <View style={styles.setsContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.subtitle}>Sets</Text>
                    <View style={{ flexGrow: 1 }}></View>
                    <IconButton
                        icon="plus"
                        size={20}
                        mode="outlined"
                        style={{ borderRadius: 5 }}
                        onPress={() => setShowSetBuilder(true)}
                    />
                </View>

                {NoSetMessage()}

                <SetViewer sets={programSets} deleteHandler={deleteSet} />

                <SetBuilder
                    visible={showSetBuilder}
                    addSet={addSet}
                    hideBuilder={() => setShowSetBuilder(false)}
                    setsNumber={programSets.length}
                />
            </View>

            <View style={styles.footerContainer}>
                <Button
                    style={{ marginRight: 20 }}
                    contentStyle={{ width: FOOTER_BTN_WIDTH }}
                    mode="outlined"
                    onPress={() => navigation.navigate(EScreens.ProgramHome)}
                >
                    Cancel
                </Button>
                <Button
                    contentStyle={{ width: FOOTER_BTN_WIDTH }}
                    mode="contained"
                    disabled={!programName || !programSets.length || !programImage}
                    onPress={() => addProgram()}
                >
                    Create
                </Button>
            </View>
        </View>
    );
}

const FOOTER_BTN_WIDTH: number = 95;

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 5,
        paddingTop: 15,
    },
    setsContainer: {
        marginTop: 5,
        flexGrow: 1,
        alignContent: 'flex-start',
    },
    footerContainer: {
        marginVertical: 20,
        flexDirection: 'row',
        alignSelf: 'flex-end',
    },
    subtitle: {
        marginVertical: 10,
        fontWeight: 'bold',
        fontSize: 16,
    },
    imageButton: {
        borderRadius: 5,
        margin: 0,
        padding: 0,
        height: 100,
        width: 100,
    },
    noSetMessageContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: 10,
        paddingLeft: 50,
        paddingRight: 10
    },
    noSetMessageText: {
        marginRight: 10,
        fontStyle: 'italic',
    }
});
