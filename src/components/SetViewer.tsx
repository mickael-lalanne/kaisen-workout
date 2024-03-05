import { useQuery } from '@realm/react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Dialog, IconButton, Portal, Text } from 'react-native-paper';
import { Exercise } from '../models/Exercise';
import { useState } from 'react';
import { Set } from '../models/Program';
import { useAppTheme } from '../app/theme';

export type SetViewerProps = {
    sets: Set[];
};

export default function SetViewer({ sets }: SetViewerProps) {
    const exercises = useQuery(Exercise);
    const theme = useAppTheme();

    const SetsList = (): React.JSX.Element[] => {
        const list: React.JSX.Element[] = [];

        sets.forEach((set) => {
            const SetImages = (): React.JSX.Element[] => {
                const imagesElements: React.JSX.Element[] = [];

                set.exerciceIds.forEach((eId) => {
                    const setExercise: Exercise = exercises.find(
                        (e) => e._id.toString() === eId.toString()
                    )!;

                    imagesElements.push(
                        <Image
                            style={styles.exerciseImage}
                            source={{ uri: setExercise.image }}
                            key={eId.toString()}
                        ></Image>
                    );
                });

                return imagesElements;
            };

            const exercisesNames: string[] = set.exerciceIds.map(
                (eId) =>
                    exercises.find((e) => e._id.toString() === eId.toString())
                        ?.name!
            );
            const setNameToDisplay: string = exercisesNames.join(' / ');

            list.push(
                <View
                    style={{
                        ...styles.setContainer,
                        borderColor: theme.colors.text,
                    }}
                    key={set._id.toString()}
                >
                    {SetImages()}
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={styles.setName}>{setNameToDisplay}</Text>
                        <Text style={styles.setDescription}>
                            {set.repsNumber}x / {set.recupDuration} secons of
                            rest
                        </Text>
                    </View>
                </View>
            );
        });

        return list;
    };

    return <View>{SetsList()}</View>;
}

const styles = StyleSheet.create({
    setContainer: {
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    // TODO: make a shared component ExerciseImage ???
    exerciseImage: {
        height: 75,
        width: 75,
        objectFit: 'cover',
    },
    setName: {
        fontWeight: 'bold',
    },
    setDescription: {
        fontStyle: 'italic',
        fontSize: 12,
    },
});
