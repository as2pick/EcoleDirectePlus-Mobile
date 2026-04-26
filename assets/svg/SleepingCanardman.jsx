import { Image } from "react-native";

export default function SleepingCanardman({ size = 120, style = {} }) {
  return (
    <Image
      source={require("../SleepingCanardman.png")}
      style={[
        {
          width: size,
          height: size,
          resizeMode: "contain",
        },
        style,
      ]}
    />
  );
}