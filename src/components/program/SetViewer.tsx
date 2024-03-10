import { useQuery } from '@realm/react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text, TouchableRipple } from 'react-native-paper';
import { Exercise } from '../../models/Exercise';
import React, { useEffect, useState } from 'react';
import { ISet } from '../../models/Program';
import { useAppTheme } from '../../app/theme';
import {
    NestableDraggableFlatList,
    NestableScrollContainer,
    RenderItemParams,
} from 'react-native-draggable-flatlist';
import { SET_HEIGHT } from '../../app/styles';
import { BSON } from 'realm';
import ExerciseImage from '../shared/ExerciseImage';

export type SetViewerProps = {
    sets: ISet[];
    deleteHandler: (setId: BSON.ObjectId) => void;
    editHandler: (setToEdit: ISet) => void;
    reorderHandler: (sets: ISet[]) => void;
};

export default function SetViewer({
    sets,
    deleteHandler,
    editHandler,
    reorderHandler,
}: SetViewerProps) {
    const [draggableSetsLists, setDraggableSetsLists] = useState<ISet[]>(sets);

    useEffect(() => {
        setDraggableSetsLists(sets);
    }, [sets]);

    const exercises = useQuery(Exercise);
    const theme = useAppTheme();

    const onSetDragEnd = (draggedSets: ISet[]) => {
        const orderedSets: ISet[] = draggedSets.map((s, i) => {
            return { ...s, order: i };
        });
        setDraggableSetsLists(orderedSets);
        reorderHandler(orderedSets);
    };

    const renderSet = ({ item, drag, isActive }: RenderItemParams<ISet>) => {
        const exercisesNames: string[] = item.exerciceIds.map(
            (eId) =>
                exercises.find((e) => e._id.toString() === eId.toString())
                    ?.name!
        );
        const setNameToDisplay: string = exercisesNames.join(' / ');

        return (
            <TouchableRipple
                onLongPress={drag}
                onPress={() => editHandler(item)}
            >
                <View
                    style={{
                        ...styles.setContainer,
                        borderColor: theme.colors.text,
                        backgroundColor: isActive
                            ? theme.colors.elevation.level3
                            : undefined,
                    }}
                >
                    <ExerciseImage
                        exercises={exercises.filter((e) =>
                            item.exerciceIds.includes(e._id.toString())
                        )}
                        size={SET_HEIGHT - 2}
                    />
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
        <NestableScrollContainer
            style={{ flex: 1, flexGrow: 1, paddingHorizontal: 5 }}
            contentContainerStyle={{ flex: 0, flexGrow: 0 }}
        >
            <NestableDraggableFlatList
                data={draggableSetsLists}
                onDragEnd={({ data }) => onSetDragEnd(data)}
                keyExtractor={(item: ISet) => item._id.toString()}
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
        right: -10,
    },
});
