import { StyleSheet } from 'react-native';
import React from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

export type ConfirmDialogProps = {
    visible: boolean;
    title: string;
    content: string;
    cancelHandler: () => void;
    confirmHandler: () => void;
};

export default function ConfirmDialog({
    visible,
    title,
    content,
    cancelHandler,
    confirmHandler,
}: ConfirmDialogProps) {
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={cancelHandler}>
                <Dialog.Title style={styles.confirmTitle}>{title}</Dialog.Title>
                <Dialog.Content>
                    <Text style={styles.confirmContent}>{content}</Text>
                </Dialog.Content>

                <Dialog.Actions style={{ marginTop: 10 }}>
                    <Button
                        onPress={cancelHandler}
                        mode="contained"
                        style={styles.footerBtn}
                    >
                        Cancel
                    </Button>
                    <Button
                        onPress={confirmHandler}
                        mode="outlined"
                        style={styles.footerBtn}
                    >
                        Confirm
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const styles = StyleSheet.create({
    confirmTitle: {
        marginBottom: 20,
        fontSize: 20,
        fontWeight: 'bold',
    },
    confirmContent: {
        fontSize: 12,
    },
    footerBtn: {
        width: 100,
    },
});
