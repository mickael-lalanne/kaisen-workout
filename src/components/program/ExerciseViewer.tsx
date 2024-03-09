import { useQuery } from '@realm/react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { Exercise } from '../../models/Exercise';
import { useAppTheme } from '../../app/theme';

export type ExerciseViewerProps = {
    pressHandler: (exercise: Exercise) => void;
    longPressHandler?: (exercise: Exercise) => void;
    addHandler?: () => void;
};

export default function ExerciseViewer({
    pressHandler,
    longPressHandler,
    addHandler,
}: ExerciseViewerProps) {
    const exercises = useQuery(Exercise);
    const theme = useAppTheme();

    const ExercisesList = (): React.JSX.Element[] => {
        const list: React.JSX.Element[] = [];

        exercises.forEach((e) => {
            list.push(
                <Pressable
                    onPress={() => pressHandler(e)}
                    onLongPress={() => longPressHandler && longPressHandler(e)}
                    key={e._id.toString()}
                >
                    <Image
                        style={styles.exerciseImage}
                        source={{ uri: e.image }}
                    ></Image>
                    <View
                        style={{
                            ...styles.exerciseNameContainer,
                            backgroundColor: theme.colors.surface,
                        }}
                    >
                        <Text numberOfLines={1} style={styles.exerciseName}>
                            {e.name}
                        </Text>
                    </View>
                </Pressable>
            );
        });

        return list;
    };

    const AddButton = (): React.JSX.Element | undefined => {
        if (addHandler) {
            return (
                <IconButton
                    icon="plus"
                    style={{
                        ...styles.exerciseImage,
                        ...styles.addExerciseBtn,
                    }}
                    onPress={addHandler}
                />
            );
        }
    };

    return (
        <View>
            <ScrollView contentContainerStyle={styles.scrollViewStyle}>
                {AddButton()}
                {ExercisesList()}
            </ScrollView>
        </View>
    );
}

const RADIUS: number = 10;

const styles = StyleSheet.create({
    exerciseNameContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        borderBottomLeftRadius: RADIUS,
        borderBottomRightRadius: RADIUS,
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
        columnGap: 15,
    },
});
