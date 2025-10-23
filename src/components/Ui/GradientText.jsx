import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Text, View } from "react-native";

export default function GradientText({
    text,
    colors = ["hsl(234, 100%, 86%)", "hsl(234, 32%, 44%)"],
    textStyle = {},
}) {
    const [size, setSize] = useState(null);

    return (
        <View
            onLayout={(e) => {
                if (!size) {
                    const { width, height } = e.nativeEvent.layout;
                    setSize({ width, height });
                }
            }}
            style={{ alignItems: "center" }}
        >
            {size ? (
                <MaskedView
                    maskElement={
                        <Text
                            style={[textStyle, { backgroundColor: "transparent" }]}
                        >
                            {text}
                        </Text>
                    }
                >
                    <LinearGradient
                        colors={colors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            width: size.width,
                            height: size.height,
                        }}
                    />
                </MaskedView>
            ) : (
                <Text
                    style={[
                        textStyle,
                        { opacity: 0, backgroundColor: "transparent" },
                    ]}
                >
                    {text}
                </Text>
            )}
        </View>
    );
}

