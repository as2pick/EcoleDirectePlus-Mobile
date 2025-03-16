import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CheckIcon from "../../assets/svg/CheckIcon";

export default function CheckBox({
    initialValue = false,
    onValueChange,
    libelle = "",
}) {
    const [isChecked, setIsChecked] = useState(initialValue);
    const { colors } = useTheme();
    const toggleCheckbox = () => {
        const newValue = !isChecked;
        setIsChecked(newValue);
        if (onValueChange) {
            onValueChange(newValue);
        }
    };

    return (
        <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={toggleCheckbox}>
                <View style={[styles.checkbox, { borderColor: colors.border }]}>
                    {isChecked && (
                        <Text>
                            <CheckIcon />
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
            <Text style={[styles.text, { color: colors.txt.txt1 }]}>{libelle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 6,
    },
    text: {
        marginLeft: 16,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
});

