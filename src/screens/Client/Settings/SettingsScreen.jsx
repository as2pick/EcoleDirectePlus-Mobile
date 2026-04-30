import { Button, Text, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";

export default function SettingsScreen() {
    const { colorScheme, isFollowingSystem, followSystemTheme, toggleTheme } =
        useTheme();

    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 16 }}>
            <Text>Theme actuel : {colorScheme}</Text>
            <Text>
                Theme systeme : {isFollowingSystem ? "active" : "desactive"}
            </Text>
            <Button onPress={toggleTheme} title="Changer de theme" />
            <Button onPress={followSystemTheme} title="Suivre le theme systeme" />
        </View>
    );
}
