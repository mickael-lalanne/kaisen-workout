import { useQuery } from '@realm/react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Dialog, IconButton, Portal, Text } from 'react-native-paper';
import { Exercise } from '../models/Exercise';
import { useAppTheme } from '../app/theme';
import ExerciseBuilder from './ExerciseBuilder';
import { useState } from 'react';

export type ExercisePickerProps = {
    visible: boolean;
    addExercise: (exercise: Exercise) => void;
    hidePicker: () => void;
};

export default function ExercicePicker({
    visible,
    addExercise,
    hidePicker,
}: ExercisePickerProps) {
    const [exerciseBuilderVisible, setExerciseBuilderVisible] = useState<boolean>(false);

    const exercises = useQuery(Exercise);
    const theme = useAppTheme();

    const ExercisesList = (): React.JSX.Element[] => {
        const list: React.JSX.Element[] = [];

        exercises.forEach((e) => {
            list.push(
                <Pressable
                    onPress={() => addExercise(e)}
                    key={e._id.toString()}
                >
                    <Image
                        style={styles.exerciseImage}
                        source={{ uri: e.image }}
                    ></Image>
                    <View style={{ ...styles.exerciseNameContainer, backgroundColor: theme.colors.surface}}>
                        <Text numberOfLines={1} style={styles.exerciseName}>{e.name}</Text>
                    </View>
                </Pressable>
            );
        });

        return list;
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hidePicker}>
                <Dialog.Title style={styles.confirmTitle}>
                    Choose an exercise
                </Dialog.Title>
                <Dialog.Content>
                    <View style={{maxHeight: 200}}>
                        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
                            <IconButton
                                icon="plus"
                                style={{...styles.exerciseImage, ...styles.addExerciseBtn}}
                                onPress={() => setExerciseBuilderVisible(true)}
                            />
                            {ExercisesList()}
                        </ScrollView>
                    </View>

                    <ExerciseBuilder
                        visible={exerciseBuilderVisible}
                        hideBuilder={() => setExerciseBuilderVisible(false)}
                        saveHandler={e => addExercise(e)}
                    ></ExerciseBuilder>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
}

const RADIUS: number = 10;

const styles = StyleSheet.create({
    confirmTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    exerciseNameContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        borderBottomLeftRadius: RADIUS,
        borderBottomRightRadius: RADIUS
    },
    exerciseName: {
        fontSize: 10,
    },
    exerciseImage: {
        height: 75,
        width: 75,
        objectFit: 'cover',
        borderRadius: RADIUS,
    },
    addExerciseBtn: {
        borderWidth: 1,
        borderColor: 'white',
        margin: 0,
    },
    scrollViewStyle: {
        flexDirection: 'row',
        flexGrow: 1,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        rowGap: 15,
        columnGap: 15
    }
});
