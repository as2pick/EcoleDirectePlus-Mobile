import { useTheme } from "@react-navigation/native";

export default createScreen = (
    screenName,
    ScreenComponent,
    options = {},
    props = {}
) => {
    const ScreenWrapper = () => {
        const theme = useTheme();
        return <ScreenComponent theme={theme} />;
    };

    return {
        screenName,
        screenComponent: ScreenWrapper,
        options,
        ...props,
    };
};

