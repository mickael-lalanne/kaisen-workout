import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Divider, Text, TouchableRipple } from 'react-native-paper';
import React, { useState } from 'react';
import { Program } from '../../models/Program';
import { useAppTheme } from '../../app/theme';
import { formatDateToReadable } from '../../app/utils';

export type ProgramViewerProps = {
    programs: Realm.Results<Program>;
    pressHandler: (program: Program) => void;
    longPressHandler?: (program: Program) => void;
    sortingMode?: 'creationDate' | 'lastUsageDate';
};

export default function ProgramViewer({
    programs,
    pressHandler,
    longPressHandler,
    sortingMode = 'creationDate',
}: ProgramViewerProps) {
    const [isScrolling, setIsScrolling] = useState<boolean>(false);

    const theme = useAppTheme();

    const ProgramList = (): React.JSX.Element[] => {
        const programElements: React.JSX.Element[] = [];

        const ProgramDivider = (
            index: number
        ): React.JSX.Element | undefined => {
            if (index < programs.length - 1) {
                return <Divider style={styles.divider} />;
            }
        };

        const sortedPrograms: Program[] = [...programs].sort((a, b) => {
            if (sortingMode === 'creationDate') {
                return a.creationDate > b.creationDate ? -1 : 1;
            } else if (a.lastUsageDate && b.lastUsageDate) {
                return a.lastUsageDate > b.lastUsageDate ? -1 : 1;
            } else if (a.lastUsageDate) {
                return -1;
            } else if (b.lastUsageDate) {
                return 1;
            } else {
                return a.creationDate > b.creationDate ? -1 : 1;
            }
        });

        const LastUsageInfo = (
            program: Program
        ): React.JSX.Element | undefined => {
            if (sortingMode === 'lastUsageDate') {
                const lastUsageText = program.lastUsageDate
                    ? 'Last workout : ' +
                      formatDateToReadable(program.lastUsageDate)
                    : 'Not used yet';

                return (
                    <Text
                        style={{
                            ...styles.programLastUse,
                            borderColor: theme.colors.inverseSurface,
                        }}
                    >
                        {lastUsageText}
                    </Text>
                );
            }
        };

        sortedPrograms.forEach((p: Program, i: number) => {
            programElements.push(
                <View style={{ flexDirection: 'row' }} key={p._id.toString()}>
                    <TouchableRipple
                        onPress={() => pressHandler(p)}
                        onLongPress={() =>
                            longPressHandler && longPressHandler(p)
                        }
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
                                {LastUsageInfo(p)}
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
        opacity: 0.5,
        minHeight: 30,
    },
    programLastUse: {
        textAlign: 'center',
        fontSize: 8,
        opacity: 0.5,
        borderTopWidth: 0.5,
        fontStyle: 'italic',
        paddingTop: 2,
        marginTop: 5,
    },
    divider: {
        width: 1,
        height: '50%',
        margin: 0,
        alignSelf: 'center',
    },
});
