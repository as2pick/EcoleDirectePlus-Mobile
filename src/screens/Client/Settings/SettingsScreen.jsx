import { Button, Text } from "react-native";
import { useAppSettings } from "../../../context/AppSettingsContext";

export default function SettingsScreen({}) {
    const { state, dispatch } = useAppSettings();
    return (
        <>
            <Text style={{ height: 300 }}>SETTINGS</Text>
            <Button
                onPress={() =>
                    dispatch({
                        type: "TOGGLE_THEME",
                        // payload: state.backgroundColor === "red" ? "blue" : "red",
                    })
                }
                title="Changecolor"
            >
                <Text>CHANGE COLOR </Text>
            </Button>
        </>
    );
}

