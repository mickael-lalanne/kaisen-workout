import { useQuery } from '@realm/react';
import { Image, StyleSheet, View } from 'react-native';
import { IconButton, Text, TouchableRipple } from 'react-native-paper';
import { Exercise } from '../models/Exercise';
import React, { useEffect, useState } from 'react';
import { Set } from '../models/Program';
import { useAppTheme } from '../app/theme';
import {
    NestableDraggableFlatList,
    NestableScrollContainer,
    RenderItemParams,
} from 'react-native-draggable-flatlist';
import { SET_HEIGHT } from '../app/styles';
import { BSON } from 'realm';

export type SetViewerProps = {
    sets: Set[];
    deleteHandler: (setId: BSON.ObjectId) => void;
};

export default function SetViewer({ sets, deleteHandler }: SetViewerProps) {
    const [draggableSetsLists, setDraggableSetsLists] = useState<Set[]>(sets);

    useEffect(() => {
        setDraggableSetsLists(sets);
    }, [sets]);

    const exercises = useQuery(Exercise);
    const theme = useAppTheme();

    const onSetDragEnd = (draggedSets: Set[]) => {
        const orderedSets: Set[] = draggedSets.map((s, i) => {
            return { ...s, order: i };
        });;
        setDraggableSetsLists(orderedSets);
    };

    const SetImages = (set: Set): React.JSX.Element[] => {
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

    const renderSet = ({ item, drag, isActive }: RenderItemParams<Set>) => {
        const exercisesNames: string[] = item.exerciceIds.map(
            (eId) =>
                exercises.find((e) => e._id.toString() === eId.toString())
                    ?.name!
        );
        const setNameToDisplay: string = exercisesNames.join(' / ');

        return (
            <TouchableRipple onLongPress={drag}>
                <View
                    style={{
                        ...styles.setContainer,
                        borderColor: theme.colors.text,
                        backgroundColor: isActive
                            ? theme.colors.elevation.level3
                            : undefined,
                    }}
                >
                    {SetImages(item)}
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={styles.setName}>{setNameToDisplay}</Text>
                        <Text style={styles.setDescription}>
                            {item.repsNumber}x / {item.recupDuration} secons of
                            rest
                        </Text>
                    </View>

                    <IconButton
                        style={styles.setDeleteBtn}
                        icon="close"
                        size={15}
                        onPress={() => deleteHandler(item._id)}
                    />
                </View>
            </TouchableRipple>
        );
    };

    return (
        <NestableScrollContainer style={{ flex: 1, flexGrow: 1, paddingHorizontal: 5 }} contentContainerStyle={{ flex: 0, flexGrow: 0 }}>
            <NestableDraggableFlatList
                data={draggableSetsLists}
                onDragEnd={({ data }) => onSetDragEnd(data)}
                keyExtractor={(item: Set) => item._id.toString()}
                renderItem={renderSet}
            />
        </NestableScrollContainer>
    );
}

const styles = StyleSheet.create({
    setContainer: {
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        height: SET_HEIGHT,
    },
    exerciseImage: {
        height: SET_HEIGHT - 2,
        width: SET_HEIGHT - 2,
        objectFit: 'cover',
    },
    setName: {
        fontWeight: 'bold',
    },
    setDescription: {
        fontStyle: 'italic',
        fontSize: 12,
    },
    setDeleteBtn: {
        position: 'absolute',
        top: -10,
        right: -10
    },
});
