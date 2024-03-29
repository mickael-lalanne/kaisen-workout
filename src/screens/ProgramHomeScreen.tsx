import { View, StyleSheet, Image } from 'react-native';
import { Button, Icon, IconButton, Text } from 'react-native-paper';
import { EScreens, RouterProps } from '../app/router';
import React, { useState } from 'react';
import { useQuery, useRealm } from '@realm/react';
import { Program } from '../models/Program';
import ProgramViewer from '../components/shared/ProgramViewer';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import { useAppTheme } from '../app/theme';

export default function ProgramHome({ navigation }: RouterProps) {
    const [programToDelete, setProgramToDelete] = useState<Program>();

    const programs = useQuery(Program);
    const realm = useRealm();
    const theme = useAppTheme();

    const deleteProgram = (): void => {
        if (programToDelete) {
            realm.write(() => {
                const program = realm.objectForPrimaryKey(
                    Program,
                    programToDelete._id
                );
                realm.delete(program);
            });
            setProgramToDelete(undefined);
        }
    };

    return (
        <View
            style={{
                ...styles.viewContainer,
                backgroundColor: theme.colors.surface,
            }}
        >
            <Text style={styles.title}>My programs</Text>

            <ProgramViewer
                programs={programs}
                pressHandler={(p: Program) =>
                    navigation.navigate(EScreens.ProgramBuilder, {
                        programId: p._id.toString(),
                    })
                }
                longPressHandler={(p: Program) => setProgramToDelete(p)}
            />

            <Button
                icon="plus-circle-outline"
                mode="outlined"
                style={styles.addButton}
                contentStyle={{ height: 60 }}
                onPress={() => navigation.navigate(EScreens.ProgramBuilder)}
            >
                CREATE A NEW PROGRAM
            </Button>

            <View style={{ flexGrow: 1 }}></View>

            <View style={{ alignSelf: 'flex-end', alignItems: 'center' }}>
                <IconButton
                    icon="weight"
                    mode="outlined"
                    size={25}
                    style={styles.exercisesBtn}
                    onPress={() => navigation.navigate(EScreens.Exercises)}
                />
                <Text style={styles.exercisesText}>Exercises</Text>
            </View>

            <ConfirmDialog
                visible={!!programToDelete}
                title={`⚠️ Delete ${programToDelete?.name} program ?`}
                content="Be carefull. Deleting the program will remove all the sets associated with it."
                confirmHandler={deleteProgram}
                cancelHandler={() => setProgramToDelete(undefined)}
            />

            <Image
                source={require('../assets/gojo.png')}
                style={styles.gojo}
                resizeMode="contain"
            />
        </View>
    );
}

const EXERCICES_BTN_SIZE: number = 70;

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        padding: 20,
    },
    title: {
        paddingLeft: 30,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addButton: {
        marginTop: 20,
        borderRadius: 5,
    },
    gojo: {
        position: 'absolute',
        bottom: 0,
        left: -5,
        width: 150,
        height: 250,
    },
    exercisesBtn: {
        height: EXERCICES_BTN_SIZE,
        width: EXERCICES_BTN_SIZE,
        borderRadius: EXERCICES_BTN_SIZE / 2,
    },
    exercisesText: {
        opacity: 0.7,
        fontStyle: 'italic',
        fontSize: 14,
    },
});
