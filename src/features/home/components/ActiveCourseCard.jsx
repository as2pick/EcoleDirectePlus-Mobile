import { View } from "react-native";

export default function ActiveCourseCard({}) {
    return (
        <View
            style={{
                backgroundColor: "hsla(235, 28%, 15%, 1)",
                borderColor: "hsla(219, 100%, 69%, 60%)",
                borderWidth: 1,
                borderRadius: 22,
            }}
        >
            <View>
                <View
                    style={{
                        backgroundColor: "hsla(219, 100%, 69%)",
                        width: 10,
                        height: 10,
                        borderRadius: 20,
                    }}
                ></View>
            </View>
        </View>
    );
}
