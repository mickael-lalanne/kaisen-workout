import { View, StyleSheet, Image } from 'react-native';
import { Exercise } from '../../models/Exercise';
import { useAppTheme } from '../../app/theme';

type SessionSetItemProps = {
    exercises: Realm.Results<Exercise> | Exercise[];
    size: number;
    round?: boolean;
    border?: boolean;
};

export default function ExerciseImage({
    exercises,
    size,
    round,
    border,
}: SessionSetItemProps) {
    const theme = useAppTheme();

    const _getImageWidth = (): number => {
        return 100 / exercises.length;
    };

    const Images = (): React.JSX.Element[] => {
        const images: React.JSX.Element[] = [];

        exercises.forEach((exercise: Exercise) => {
            images.push(
                <Image
                    style={{
                        ...styles.exerciseImage,
                        width: (_getImageWidth() + '%') as any,
                    }}
                    source={{ uri: exercise.image }}
                    key={exercise._id.toString()}
                ></Image>
            );
        });
        return images;
    };

    return (
        <View
            style={{
                ...styles.viewContainer,
                borderColor: theme.colors.onSurface,
                height: size,
                width: size,
                borderRadius: round ? size / 2 : undefined,
                borderWidth: border ? 1 : 0,
            }}
        >
            {Images()}
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        overflow: 'hidden',
        flexDirection: 'row',
    },
    exerciseImage: {
        width: '20%',
        height: '100%',
    },
});
