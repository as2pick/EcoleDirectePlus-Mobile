import { useTheme } from "@react-navigation/native";
import { View } from "react-native";
import { UiStyles } from "./UiStyles";

export default function Separation() {
    const { colors } = useTheme();
    return (
        <View style={UiStyles.separationParent}>
            <View
                style={[
                    UiStyles.separationChildren,
                    { backgroundColor: colors.txt.txt1 },
                ]}
            />
        </View>
    );
}

