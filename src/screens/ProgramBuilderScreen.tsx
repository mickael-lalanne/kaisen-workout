import { View, StyleSheet } from 'react-native';
import { BSON } from 'realm';
import { useRealm } from '@realm/react';
import React, { useState } from 'react';
import { Button, Text, TextInput } from 'react-native-paper';
import { Program, Set } from '../models/Program';
import SetBuilder from '../components/SetBuilder';
import SetViewer from '../components/SetViewer';

export default function ProgramBuilderScreen() {
    const realm = useRealm();
    const [programName, setProgramName] = useState<string>('');
    const [programSets, setProgramSets] = useState<Set[]>([]);
    const [showSetBuilder, setShowSetBuilder] = useState<boolean>(false);

    /**
     * Add a program to the local database
     */
    const addProgram = (): void => {
        realm.write(() => {
            realm.create(Program, {
                _id: new BSON.ObjectId(),
                name: programName,
            });
        });
    };

    const addSet = (setToAdd: Set): void => {
        setProgramSets(programSets.concat(setToAdd));
    };

    return (
        <View style={styles.viewContainer}>
            <TextInput
                label="Program Name"
                value={programName}
                onChangeText={(text) => setProgramName(text)}
            />

            {/* TODO : IMAGE */}

            <View style={styles.setsContainer}>
                <SetViewer sets={programSets} />

                <Button mode="outlined" onPress={() => setShowSetBuilder(true)}>
                    Add set
                </Button>
                <SetBuilder
                    visible={showSetBuilder}
                    addSet={addSet}
                    hideBuilder={() => setShowSetBuilder(false)}
                />
            </View>

            <View style={{ flex: 1 }}></View>
            <View style={styles.footerContainer}>
                <Button
                    // icon="save"
                    style={{ marginRight: 20 }}
                    contentStyle={{ width: 95 }}
                    mode="outlined"
                    onPress={() => console.log('Pressed')}
                >
                    Cancel
                </Button>
                <Button
                    // icon="save"
                    contentStyle={{ width: 95 }}
                    mode="contained"
                    onPress={() => addProgram()}
                >
                    Save
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    setsContainer: {
        margin: 20,
    },
    footerContainer: {
        margin: 20,
        flexDirection: 'row',
        alignSelf: 'flex-end',
    },
    footerButton: {},
});
