import { Text } from "@/components";
import { ProgressBar } from "@/components/progression/ProgressBar";
import { BackArrow } from "@/components/svg";
import { View } from "react-native";

export default function ActiveCourseCard({}) {
    return (
        <View
            style={{
                backgroundColor: "hsla(235, 28%, 15%, 1)",
                borderColor: "hsla(219, 100%, 69%, 0.6)",
                borderWidth: 1,
                borderRadius: 22,
                width: "100%",
                padding: 19,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 8,
                }}
            >
                <View
                    style={{
                        backgroundColor: "hsla(219, 100%, 69%, 1)",
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                    }}
                />
                <Text color="hsla(219, 100%, 69%, 1)">EN COURS</Text>
            </View>
            <View
                style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginBottom: 5,
                }}
            >
                <Text color="hsla(1, 100%, 100%, 0.9)" preset="h3">
                    Maths
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <BackArrow
                        props={{ transform: [{ rotate: "180deg" }] }}
                        fill={"hsla(1, 100%, 100%, 0.9)"}
                        size={22}
                    />
                    <Text preset="label1" color="hsla(1, 100%, 100%, 0.9)">
                        10h30
                    </Text>
                </View>
            </View>
            <View style={{ justifyContent: "space-between", marginBottom: 12 }}>
                <ProgressBar
                    progression={0.7}
                    color="hsla(228, 100%, 69%, 0.85)"
                    style={{
                        backgroundColor: "hsla(228, 100%, 69%, .25)",
                        height: 10,
                    }}
                />
            </View>

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        height: 1,
                        backgroundColor: "hsla(0, 0%, 100%, 0.4)",
                    }}
                />
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: "hsla(0, 0%, 100%, 0.1)",
                        backgroundColor: "hsla(0, 0%, 100%, 0.08)",
                        borderRadius: 20,
                        paddingHorizontal: 18,
                        paddingVertical: 4,
                        marginHorizontal: 8,
                    }}
                >
                    <Text>Dans 23 min</Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        height: 1,
                        backgroundColor: "hsla(0, 0%, 100%, 0.4)",
                    }}
                />
            </View>

            <View style={{ gap: 7 }}>
                <View
                    style={{ flexDirection: "row", justifyContent: "space-between" }}
                >
                    <Text preset="h2" color="hsla(1, 0%, 100%, .9)">
                        Français
                    </Text>
                    <View
                        style={{
                            backgroundColor: "hsla(219, 100%, 69%, 0.12)",
                            alignSelf: "flex-end",
                            borderColor: "hsla(219, 100%, 69%, 0.20)",
                            borderWidth: 1,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 8,
                        }}
                    >
                        <Text color="hsl(219, 100%, 69%)">E205</Text>
                    </View>
                </View>
                <View
                    style={{ flexDirection: "row", justifyContent: "space-between" }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <Text color="hsla(1, 0%, 100%, .9)">M. LABRU TO</Text>
                        <View
                            style={{
                                width: 6,
                                height: 6,
                                backgroundColor: "hsla(0, 0%, 100%, 0.9)",
                                borderRadius: 12,
                            }}
                        />
                        <Text color="hsla(1, 0%, 100%, .9)">1h30</Text>
                    </View>
                    <Text color="hsla(1, 0%, 100%, .9)">10h45 / 11h30</Text>
                </View>
            </View>
        </View>
    );
}

