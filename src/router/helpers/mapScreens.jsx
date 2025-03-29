import { useMemo } from "react";

export default function mapScreens({ screenArray, navMethod }) {
    return useMemo(() => {
        return screenArray.map((screen, i) => (
            <navMethod.Screen
                name={screen.screenName}
                component={screen.screenComponent}
                options={{
                    headerShown: screen.options?.headerShown ?? false,
                    ...screen.options,
                }}
                key={i}
            />
        ));
    }, [screenArray]);
}

