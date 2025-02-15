import { Text, View } from "react-native";

export default function GradesScreen({ theme }) {
    return (
        <View>
            <Text style={{ color: theme.colors.text }}>
                This is the Grades Page !
            </Text>
        </View>
    );
}

