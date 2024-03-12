import { StyleSheet } from 'react-native';
import { useObject, useRealm } from '@realm/react';
import { BSON } from 'realm';
import NumberInput from '../shared/NumberInput';
import {
    SessionRep as SessionRepModel,
    SessionSet,
} from '../../models/Session';
import { useEffect, useState } from 'react';

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
    const [localWeight, setLocalWeight] = useState<number>();

    const realm = useRealm();

    const rep: SessionRepModel | null = useObject(SessionRepModel, repId);
    const sessionSet: SessionSet | null = useObject(SessionSet, sessionSetId);

    useEffect(() => {
        setLocalWeight(rep?.weight || 0);
    }, [repId])

    const onWeightInputChange = (textWeight: string) => {
        if (!sessionSet) {
            return;
        }
        const weight: number = Number(textWeight);

        if (rep && rep.weight !== weight) {
            realm.write(() => {
                rep.weight = weight;
            });
        }
        setLocalWeight(weight);
    };

    return (
        <NumberInput
            value={localWeight === 0 ? '' : localWeight?.toString() || ''}
            style={styles.repNumber}
            label={ORDINAL_NUMBER[rep?.order!] + ' rep'}
            changeHandler={(textWeight) => onWeightInputChange(textWeight)}
            noError
        />
    );
}

const styles = StyleSheet.create({
    repsContainer: {},
    repNumber: {
        width: 79,
    },
});
