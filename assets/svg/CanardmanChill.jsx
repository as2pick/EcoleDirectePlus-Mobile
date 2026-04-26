import { Image } from "react-native";

export default function CanardmanChill({ size = 120, style = {} }) {
  return (
    <Image
      source={require("../CanardmanChill.png")}
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