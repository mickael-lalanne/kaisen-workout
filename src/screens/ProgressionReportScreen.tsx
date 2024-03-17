import { View, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { RouterProps } from '../app/router';
import { Session, SessionSet } from '../models/Session';
import { useQuery, useRealm } from '@realm/react';
import { Card, Icon, Surface, Text } from 'react-native-paper';
import { BSON } from 'realm';
import {
    convertKgToLb,
    formatDateToReadable,
    getDurationBeweenDates,
    roundTwoDecimals,
} from '../app/utils';
import { useAppTheme } from '../app/theme';
import { Exercise } from '../models/Exercise';
import ExerciseImage from '../components/shared/ExerciseImage';
import { ORDINAL_NUMBER } from '../app/constants';
import { EWeightUnit, Preferences } from '../models/Preferences';

export default function ProgressionReportScreen({ route }: RouterProps) {
    const realm = useRealm();
    const theme = useAppTheme();

    const preferences: Preferences | undefined = useQuery(
        Preferences,
        (collection) => collection
    ).at(0);

    const session: Session | null = realm.objectForPrimaryKey(
        Session,
        new BSON.ObjectId(route.params.sessionId)
    );
    const sessionExerciceIds: BSON.ObjectId[] =
        session?.sets.flatMap((set) =>
            set.exerciceIds.map((exercise) => exercise)
        ) || [];

    const exercices: Realm.Results<Exercise> = realm
        .objects(Exercise)
        .filtered('_id IN $0', sessionExerciceIds);

    const SetNotes = (): React.JSX.Element | undefined => {
        if (session && session.note) {
            return (
                <>
                    <Text style={styles.reportSubtitle}>Notes</Text>
                    <Text style={styles.reportNotes}>{session.note}</Text>
                </>
            );
        }
    };

    const SetReport = (set: SessionSet): React.JSX.Element => {
        const repsElement: React.JSX.Element[] = [];
        const unitToDisplay: string =
            preferences && preferences.weightUnit === EWeightUnit.LB
                ? 'lb'
                : 'kg';

        set.reps.forEach((rep, index) => {
            const weightToDisplay: number =
                preferences?.weightUnit === EWeightUnit.LB
                    ? roundTwoDecimals(convertKgToLb(rep.weight))
                    : rep.weight;

            repsElement.push(
                <Text key={index} style={styles.repText}>
                    {ORDINAL_NUMBER[rep.order]} rep : {rep.number} x{' '}
                    {weightToDisplay} {unitToDisplay}
                </Text>
            );
        });

        const setExercises: Exercise[] = exercices.filter((e) =>
            set.exerciceIds.includes(e._id)
        );

        const orderIconSource: string =
            set.order + 1 > 9
                ? 'numeric-9-plus-box-outline'
                : 'numeric-' + (set.order + 1) + '-box-outline';

        return (
            <Surface
                elevation={5}
                style={styles.setContainer}
                key={set._id.toString()}
            >
                <View
                    style={{
                        ...styles.setHeader,
                        backgroundColor: theme.colors.elevation.level3,
                    }}
                >
                    <ExerciseImage
                        exercises={setExercises}
                        size={50}
                        style={{
                            borderTopLeftRadius: BORDER_RADIUS,
                            marginRight: 5,
                        }}
                    />
                    <Icon source={orderIconSource} size={30} />
                    <Text style={{ marginLeft: 5 }}>
                        {setExercises.map((e) => e.name).join(' / ')}
                    </Text>
                </View>
                <View style={styles.repsContainer}>{repsElement}</View>
            </Surface>
        );
    };

    if (!session) {
        return <Text>Session not found</Text>;
    }

    return (
        <ScrollView>
            <Card
                style={{
                    ...styles.viewContainer,
                    borderColor: theme.colors.onSurface,
                }}
            >
                <View style={styles.reportTitleContainer}>
                    <Text style={styles.reportTitle}>
                        {formatDateToReadable(session.date)}
                    </Text>
                    <Text style={styles.reportDuration}>
                        ({getDurationBeweenDates(session.date, session.endDate!)})
                    </Text>
                </View>
                <Card.Content>
                    {SetNotes()}
                    <Text style={styles.reportSubtitle}>Sets</Text>
                    <View style={styles.setsContainer}>
                        {session?.sets.map((set) => SetReport(set))}
                    </View>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const BORDER_RADIUS: number = 10;

const styles = StyleSheet.create({
    viewContainer: {
        margin: 15,
    },
    reportTitleContainer: {
        marginTop: 15,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    reportTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    reportDuration: {
        paddingBottom: 2,
        marginLeft: 5,
        fontSize: 11,
        fontStyle: 'italic',
        opacity: 0.7,
    },
    reportSubtitle: {
        fontSize: 17,
        textDecorationLine: 'underline',
        paddingLeft: 20,
        marginVertical: 5,
    },
    reportNotes: {
        fontSize: 14,
        opacity: 0.7,
        fontStyle: 'italic',
        marginTop: 5,
    },
    setHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopRightRadius: BORDER_RADIUS,
        borderTopLeftRadius: BORDER_RADIUS,
    },
    setsContainer: {
        marginTop: 5,
        justifyContent: 'space-between',
        gap: 10,
    },
    setContainer: {
        flexGrow: 1,
        borderRadius: BORDER_RADIUS,
    },
    repsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 7,
        gap: 10,
        columnGap: 5,
    },
    repText: {
        paddingHorizontal: 5,
        fontSize: 9,
    },
});
