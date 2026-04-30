import { StyleSheet, Text } from "react-native";
import { UiStyles } from "./UiStyles";
export default function Title({ customStyle = {}, children }) {
    const combinedStyles = StyleSheet.flatten([UiStyles.title, customStyle]);
    return <Text style={[combinedStyles]}>{children}</Text>;
}

