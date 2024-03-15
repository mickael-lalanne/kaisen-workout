import { StyleSheet, View } from 'react-native';
import { useObject, useQuery, useRealm } from '@realm/react';
import { BSON } from 'realm';
import NumberInput from '../shared/NumberInput';
import {
    Session,
    SessionRep as SessionRepModel,
    SessionSet,
} from '../../models/Session';
import { useEffect, useState } from 'react';
import { useAppTheme } from '../../app/theme';
import { Text } from 'react-native-paper';
import { EWeightUnit, Preferences } from '../../models/Preferences';
import {
    convertKgToLb,
    convertLbToKg,
    roundTwoDecimals,
} from '../../app/utils';
import { selectCurrentSessionId } from '../../features/currentSession';
import { useAppSelector } from '../../app/hooks';
import {
    getLastSession,
    getMaxSessionRep,
} from '../../services/SessionService';

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
    const [localNumber, setLocalNumber] = useState<number>(0);
    const [unitToDisplay, setUnitToDisplay] = useState<string>('kg');
    const [maxRepWeight, setMaxRepWeight] = useState<number>();
    const [maxRepNumber, setMaxRepNumber] = useState<number>();

    const realm = useRealm();
    const theme = useAppTheme();
    const currentSessionId: string | undefined = useAppSelector(
        selectCurrentSessionId
    );

    const session: Session | null = useObject(
        Session,
        new BSON.ObjectId(currentSessionId)
    );
    const rep: SessionRepModel | null = useObject(SessionRepModel, repId);
    const sessionSet: SessionSet | null = useObject(SessionSet, sessionSetId);
    const preferences: Preferences | undefined = useQuery(
        Preferences,
        (collection) => collection
    ).at(0);
    const lastSession: Session | undefined = useQuery(
        Session,
        getLastSession(session?.programId!)
    ).at(0);
    const allSessions: Realm.Results<Session> = useQuery(Session);

    useEffect(() => {
        const maxRep: SessionRepModel | undefined = getMaxSessionRep(
            realm,
            rep
        );
        if (maxRep) {
            setMaxRepWeight(maxRep.weight);
            setMaxRepNumber(maxRep.number);
        }
    }, [allSessions]);

    useEffect(() => {
        const weightToDisplay: number =
            preferences && preferences.weightUnit === EWeightUnit.LB
                ? convertKgToLb(rep?.weight || 0)
                : rep?.weight || 0;
        setLocalWeight(roundTwoDecimals(weightToDisplay));
        setLocalNumber(rep?.number || 0);
    }, [repId]);

    useEffect(() => {
        setUnitToDisplay(
            preferences && preferences.weightUnit === EWeightUnit.LB
                ? 'lb'
                : 'kg'
        );
    }, [preferences]);

    const onNumberInputChange = (textNumber: string) => {
        if (!sessionSet) {
            return;
        }
        let numberValue: number = Number(textNumber);

        if (rep && rep.number !== numberValue) {
            realm.write(() => {
                rep.number = numberValue;
            });
        }
        setLocalNumber(numberValue);
    };

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
                lastSessionRepWeight = roundTwoDecimals(lastSessionRepWeight);
                return (
                    <Text style={styles.repInfo}>
                        Last : {lastSessionRep.number} x {lastSessionRepWeight}{' '}
                        {unitToDisplay}
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
            maxRepWeightToDisplay = roundTwoDecimals(maxRepWeightToDisplay);
            return (
                <Text style={styles.repInfo}>
                    Max : {maxRepNumber} x {maxRepWeightToDisplay}{' '}
                    {unitToDisplay}
                </Text>
            );
        }
    };

    return (
        <View>
            <Text style={styles.repTitle}>
                {ORDINAL_NUMBER[rep?.order!] + ' rep'}
            </Text>
            <View
                style={{
                    ...styles.repsContainer,
                    backgroundColor:
                        localWeight > 0
                            ? theme.colors.success
                            : theme.colors.elevation.level2,
                }}
            >
                <NumberInput
                    value={
                        localNumber === 0 ? '' : localNumber.toString() || ''
                    }
                    style={styles.repNumberInput}
                    contentStyle={{ paddingLeft: 5 }}
                    inputStyle={{
                        backgroundColor:
                            localWeight > 0
                                ? theme.colors.success
                                : theme.colors.elevation.level2,
                        ...styles.commonInputStyle,
                    }}
                    dense
                    changeHandler={(textWeight) =>
                        onNumberInputChange(textWeight)
                    }
                    noError
                />
                <Text>x</Text>
                <NumberInput
                    value={
                        localWeight === 0 ? '' : localWeight?.toString() || ''
                    }
                    style={styles.repWeightInput}
                    contentStyle={{ paddingLeft: 10 }}
                    inputStyle={{
                        backgroundColor:
                            localWeight > 0
                                ? theme.colors.success
                                : theme.colors.elevation.level2,
                        ...styles.commonInputStyle,
                    }}
                    dense
                    changeHandler={(textWeight) =>
                        onWeightInputChange(textWeight)
                    }
                    noError
                />
                <Text>{unitToDisplay}</Text>
            </View>
            {LastRepInfo()}
            {MaxRepInfo()}
        </View>
    );
}

const styles = StyleSheet.create({
    repsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 15,
        paddingTop: 5,
    },
    repTitle: {
        position: 'absolute',
        zIndex: 1,
        fontSize: 10,
        top: 3,
        left: 10,
        fontStyle: 'italic',
        opacity: 0.5,
    },
    repNumberInput: {
        width: 45,
        marginVertical: 5,
    },
    repWeightInput: {
        width: 65,
        marginVertical: 5,
    },
    commonInputStyle: {
        paddingLeft: 0,
        marginLeft: 0,
    },
    repInfo: {
        fontSize: 7,
        fontStyle: 'italic',
        opacity: 0.5,
        paddingLeft: 10,
    },
});
