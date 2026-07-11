import { Button, Text } from "react-native";
import { useThemeStore } from "@/hooks/useThemeStore";

export default function SettingsScreen({ }) {
    const themeMode = useThemeStore((state) => state.themeMode);
    const setThemeMode = useThemeStore((state) => state.setThemeMode);

    return (
        <>
            <Text style={{ height: 300 }}>SETTINGS</Text>
            <Button
                onPress={() =>
                    setThemeMode(themeMode === 'light' ? 'dark' : 'light')
                }
                title="Changecolor"
            >
                <Text>CHANGE COLOR </Text>
            </Button>
        </>
    );
}

