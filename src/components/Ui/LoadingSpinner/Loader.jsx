import LottieView from "lottie-react-native";
import React from "react";

const LoadingSpinner = ({ size }) => {
    return (
        <LottieView
            autoPlay
            source={require("../../../../assets/json/lottie/loader.json")}
            loop
            speed={1.5}
            style={{ width: size, height: size }}
        />
    );
};

export default LoadingSpinner;

