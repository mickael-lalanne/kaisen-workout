import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Divider, Text, TouchableRipple } from 'react-native-paper';
import React, { useState } from 'react';
import { Program } from '../../models/Program';
import { useAppTheme } from '../../app/theme';
import { EScreens, RouterProps } from '../../app/router';
import { useRealm } from '@realm/react';
import ConfirmDialog from '../shared/ConfirmDialog';

export type ProgramViewerProps = {
    programs: Realm.Results<Program>;
    navigation: RouterProps['navigation'];
};

export default function ProgramViewer({
    navigation,
    programs,
}: ProgramViewerProps) {
    const [isScrolling, setIsScrolling] = useState<boolean>(false);
    const [programToDelete, setProgramToDelete] = useState<Program>();

    const theme = useAppTheme();
    const realm = useRealm();

    const deleteProgram = () => {
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

    const ProgramList = (): React.JSX.Element[] => {
        const programElements: React.JSX.Element[] = [];

        const ProgramDivider = (
            index: number
        ): React.JSX.Element | undefined => {
            if (index < programs.length - 1) {
                return <Divider style={styles.divider} />;
            }
        };

        programs.forEach((p: Program, i: number) => {
            programElements.push(
                <View style={{ flexDirection: 'row' }} key={p._id.toString()}>
                    <TouchableRipple
                        onPress={() =>
                            navigation.navigate(EScreens.ProgramBuilder, {
                                programId: p._id.toString(),
                            })
                        }
                        onLongPress={() => setProgramToDelete(p)}
                        background={
                            isScrolling ? 'rgba(0, 0, 0, 0)' : undefined
                        }
                        style={{ padding: 10 }}
                    >
                        <View style={styles.programContent}>
                            <Image
                                source={{ uri: p.image }}
                                style={styles.programImage}
                            />
                            <View style={styles.programText}>
                                <Text
                                    style={styles.programName}
                                    numberOfLines={1}
                                >
                                    {p.name}
                                </Text>
                                <Text
                                    style={styles.programDescription}
                                    numberOfLines={3}
                                >
                                    {p.description}
                                </Text>
                            </View>
                        </View>
                    </TouchableRipple>
                    {ProgramDivider(i)}
                </View>
            );
        });

        return programElements;
    };

    return (
        <View>
            <ScrollView
                horizontal
                style={{ flexDirection: 'row' }}
                contentContainerStyle={{
                    ...styles.programsContainer,
                    borderColor: theme.colors.text,
                }}
                onScrollBeginDrag={() => setIsScrolling(true)}
                onScrollEndDrag={() => setIsScrolling(false)}
            >
                {ProgramList()}
            </ScrollView>

            <ConfirmDialog
                visible={!!programToDelete}
                title={`⚠️ Delete ${programToDelete?.name} program ?`}
                content="Be carefull. Deleting the program will remove all the sets and the sessions associated with it."
                confirmHandler={deleteProgram}
                cancelHandler={() => setProgramToDelete(undefined)}
            />
        </View>
    );
}

const PROGRAM_ITEM_SIZE: number = 120;

const styles = StyleSheet.create({
    programsContainer: {},
    programContent: {
        width: PROGRAM_ITEM_SIZE,
    },
    programImage: {
        width: PROGRAM_ITEM_SIZE,
        height: PROGRAM_ITEM_SIZE,
        borderRadius: PROGRAM_ITEM_SIZE / 2,
    },
    programText: {
        marginTop: 5,
        alignContent: 'center',
        alignItems: 'center',
    },
    programName: {
        flexGrow: 1,
        alignSelf: 'center',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    programDescription: {
        textAlign: 'center',
        fontSize: 8,
        color: 'grey',
    },
    divider: {
        width: 1,
        height: '50%',
        margin: 0,
        alignSelf: 'center',
    },
});
