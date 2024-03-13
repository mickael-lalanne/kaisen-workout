import { StyleSheet, View } from 'react-native';
import { useObject, useQuery, useRealm } from '@realm/react';
import { BSON } from 'realm';
import NumberInput from '../shared/NumberInput';
import {
    ESessionState,
    Session,
    SessionRep as SessionRepModel,
    SessionSet,
} from '../../models/Session';
import { useEffect, useState } from 'react';
import { useAppTheme } from '../../app/theme';
import { Text } from 'react-native-paper';
import { EWeightUnit, Preferences } from '../../models/Preferences';
import { convertKgToLb, convertLbToKg } from '../../app/utils';

const ORDINAL_NUMBER: string[] = [
    '1st',
    '2nd',
    '3rd',
    '4th',
    '5th',
    '6th',
    '7th',
    '8th',
    '9th',
    '10th',
];

type SessionRepProps = {
    sessionSetId: BSON.ObjectId;
    repId: BSON.ObjectId;
};

export default function SessionRep({ sessionSetId, repId }: SessionRepProps) {
    const [localWeight, setLocalWeight] = useState<number>(0);
    const [unitToDisplay, setUnitToDisplay] = useState<string>('kg');
    const [maxRepWeight, setMaxRepWeight] = useState<number>();

    const realm = useRealm();
    const theme = useAppTheme();

    // TODO : duplicate code (store session id in store ?)
    const session: Session | undefined = useQuery(Session, (collection) =>
        collection
            .sorted('date')
            .filtered('state == $0', ESessionState.InProgress)
    ).at(0);
    const rep: SessionRepModel | null = useObject(SessionRepModel, repId);
    const sessionSet: SessionSet | null = useObject(SessionSet, sessionSetId);
    const preferences: Preferences | undefined = useQuery(
        Preferences,
        (collection) => collection
    ).at(0);
    const lastSession: Session | undefined = useQuery(Session, (collection) =>
        collection
            .sorted('date', true)
            .filtered('state != $0', ESessionState.InProgress)
            .filtered('programId == $0', session?.programId)
    ).at(0);
    const allSessions: Realm.Results<Session> = useQuery(Session);

    useEffect(() => {
        const maxRep: number | undefined = realm.objects(SessionRepModel)
            .filtered('exerciseId == $0', rep?.exerciseId)
            .filtered('order == $0', rep?.order)
            .max('weight') as number | undefined;
        setMaxRepWeight(maxRep);
    }, [allSessions]);

    useEffect(() => {
        const weightToDisplay: number =
            preferences && preferences.weightUnit === EWeightUnit.LB
                ? convertKgToLb(rep?.weight || 0)
                : rep?.weight || 0;
        setLocalWeight(weightToDisplay);
    }, [repId]);

    useEffect(() => {
        setUnitToDisplay(
            preferences && preferences.weightUnit === EWeightUnit.LB
                ? 'lb'
                : 'kg'
        );
    }, [preferences]);

    const onWeightInputChange = (textWeight: string) => {
        if (!sessionSet) {
            return;
        }
        let weight: number = Number(textWeight);
        // In base, the weight is saved in kg, whatever the user's preferences
        let weightToSave: number =
            preferences && preferences.weightUnit === EWeightUnit.LB
                ? convertLbToKg(weight)
                : weight;

        if (rep && rep.weight !== weightToSave) {
            realm.write(() => {
                rep.weight = weightToSave;
            });
        }
        setLocalWeight(weight);
    };

    const LastRepInfo = (): React.JSX.Element | undefined => {
        if (lastSession && lastSession.sets.length > 0 && rep) {
            let lastSessionRep: SessionRepModel | undefined = undefined;
            let i: number = 0;
            while (!lastSessionRep && i < lastSession.sets.length) {
                lastSessionRep = lastSession.sets[i].reps.find(
                    (r) =>
                        r.exerciseId.toString() === rep.exerciseId.toString() &&
                        r.order === rep.order
                );
                i++;
            }
            if (lastSessionRep && lastSessionRep.weight > 0) {
                let lastSessionRepWeight: number =
                    preferences && preferences.weightUnit === EWeightUnit.LB
                        ? convertKgToLb(lastSessionRep.weight)
                        : lastSessionRep.weight;

                return (
                    <Text style={styles.repInfo}>
                        Last : {lastSessionRepWeight} {unitToDisplay}
                    </Text>
                );
            }
        }
    };

    const MaxRepInfo = (): React.JSX.Element | undefined => {
        if (maxRepWeight && maxRepWeight > 0) {
            let maxRepWeightToDisplay: number =
                preferences && preferences.weightUnit === EWeightUnit.LB
                    ? convertKgToLb(maxRepWeight)
                    : maxRepWeight;
            return (
                <Text style={styles.repInfo}>
                    Max : {maxRepWeightToDisplay} {unitToDisplay}
                </Text>
            );
        }
    };

    return (
        <View>
            <NumberInput
                value={localWeight === 0 ? '' : localWeight?.toString() || ''}
                style={styles.repNumber}
                contentStyle={{ paddingLeft: 10 }}
                inputStyle={{
                    backgroundColor:
                        localWeight > 0
                            ? theme.colors.success
                            : theme.colors.elevation.level2,
                    paddingLeft: 0,
                    marginLeft: 0,
                }}
                label={ORDINAL_NUMBER[rep?.order!] + ' rep'}
                changeHandler={(textWeight) => onWeightInputChange(textWeight)}
                noError
            />
            {LastRepInfo()}
            {MaxRepInfo()}
        </View>
    );
}

const styles = StyleSheet.create({
    repsContainer: {},
    repNumber: {
        width: 86,
        marginBottom: 5,
    },
    repInfo: {
        fontSize: 7,
        fontStyle: 'italic',
        opacity: 0.5,
        paddingLeft: 5,
    },
});
