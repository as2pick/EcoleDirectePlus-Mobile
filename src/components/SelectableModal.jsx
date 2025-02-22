import React, { useState } from "react";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SelectableModal({
    visible,
    onClose,
    items,
    onSelect,
    question,
}) {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleSelectItem = (item) => setSelectedItem(item);

    const handleConfirmSelection = () => {
        onSelect(selectedItem);
        onClose();
        setSelectedItem(null);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => handleSelectItem(item)}
            style={[styles.item, selectedItem === item && styles.selectedItem]}
        >
            <Text
                style={[
                    styles.itemText,
                    selectedItem === item && styles.selectedText,
                ]}
            >
                {item}
            </Text>
        </TouchableOpacity>
    );
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{question}</Text>
                    <FlatList
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ paddingVertical: 10 }}
                        style={styles.flatList}
                    />

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            onPress={handleConfirmSelection}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose} style={styles.button}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        height: 200,
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: 300,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    flatList: {
        maxHeight: 280,
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    itemText: {
        fontSize: 16,
    },
    selectedText: {
        fontSize: 18,
        color: "green",
    },
    selectedItem: {
        backgroundColor: "#f0f8ff",
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
});

