import { View, StyleSheet, Button, TextInput } from 'react-native';
import MyText from '../shared/MyText';
import { BSON } from 'realm';
import { Exercise } from '../../models/Exercise';
import { useRealm } from '@realm/react';
import { useState } from 'react';

export default function ProgramScreen() {
    const realm = useRealm();
    const [exerciseName, setExerciseName] = useState('');

    /**
     * Add an exercices to the local database
     */
    const addExecise = (): void => {
        realm.write(() => {
            realm.create(Exercise, {
                _id: new BSON.ObjectId(),
                name: exerciseName,
            });
        });
    };

    return (
        <View style={styles.viewContainer}>
            <MyText text="Program Screen"></MyText>

            <TextInput
                onChangeText={setExerciseName}
                value={exerciseName}
                placeholder="Exercise name"
            />
            <Button title="Add Exercise" onPress={addExecise} />
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
