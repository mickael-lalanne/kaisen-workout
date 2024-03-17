import { useQuery } from '@realm/react';
import { Image, StyleSheet, View } from 'react-native';
import { Session } from '../models/Session';
import { getFinishedSessions } from '../services/SessionService';
import { DataTable, Text } from 'react-native-paper';
import React, { useState } from 'react';
import { formatDateToReadable, getDurationBeweenDates } from '../app/utils';
import { Program } from '../models/Program';
import { EScreens, RouterProps } from '../app/router';
import InfoBox from '../components/shared/InfoBox';
import { useAppTheme } from '../app/theme';

export default function ProgressionDataTableScreen({ navigation }: RouterProps) {
    const [page, setPage] = useState<number>(0);
    const [numberOfItemsPerPageList] = useState([6, 3, 4]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );

    const theme = useAppTheme();

    const sessions: Realm.Results<Session> = useQuery(
        Session,
        getFinishedSessions
    );
    const programs: Realm.Results<Program> = useQuery(Program);

    const from: number = page * itemsPerPage;
    const to: number = Math.min((page + 1) * itemsPerPage, sessions.length);

    const SessionRow = (session: Session) => {
        const program: Program | undefined = programs
            .filtered('_id == $0', session.programId)
            .at(0);
        const ProgramImage: React.JSX.Element = program ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    source={{ uri: program.image }}
                    style={styles.programImage}
                />
                <Text>{program.name}</Text>
            </View>
        ) : (
            <Text style={styles.noProgramText}>
                Program doesn't exists anymore
            </Text>
        );

        return (
            <>
                <DataTable.Cell>
                    {formatDateToReadable(session.date)}
                </DataTable.Cell>
                <DataTable.Cell>{ProgramImage}</DataTable.Cell>
                <DataTable.Cell numeric>{getDurationBeweenDates(session.date, session.endDate!)}</DataTable.Cell>
            </>
        );
    };

    const NoSessionMessage = (): React.JSX.Element | undefined => {
        if (sessions.length === 0) {
            return (
                <InfoBox
                    style={{ margin: 20 }}
                    text={`It seems you don't have any session yet.\nCome back after completing a training !`}
                />
            );
        }
    };

    return (
        <View style={{...styles.container, backgroundColor: theme.colors.surface}}>
            {NoSessionMessage()}

            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Date</DataTable.Title>
                    <DataTable.Title>Program</DataTable.Title>
                    <DataTable.Title numeric>Duration</DataTable.Title>
                </DataTable.Header>

                {sessions.slice(from, to).map((session) => (
                    <DataTable.Row
                        key={session._id.toString()}
                        onPress={() =>
                            navigation.navigate(EScreens.ProgressionReport, {
                                sessionId: session._id.toString(),
                            })
                        }
                    >
                        {SessionRow(session)}
                    </DataTable.Row>
                ))}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(sessions.length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${sessions.length}`}
                    numberOfItemsPerPage={itemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                    showFastPaginationControls
                />
            </DataTable>
    
            <Image
                source={require('../assets/nanami.png')}
                style={styles.nanami}
                resizeMode="contain"
            />
        </View>
    );
}

const PROGRAM_IMAGE_SIZE: number = 30;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    programImage: {
        height: PROGRAM_IMAGE_SIZE,
        width: PROGRAM_IMAGE_SIZE,
        borderRadius: PROGRAM_IMAGE_SIZE / 2,
        marginRight: 8,
    },
    noProgramText: {
        fontStyle: 'italic',
        opacity: 0.5,
        fontSize: 12,
    },
    nanami: {
        position: 'absolute',
        bottom: 0,
        right: -25,
        width: 160,
        height: 185,
    },
});
