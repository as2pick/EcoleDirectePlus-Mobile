import LottieView from "lottie-react-native";

const LoadingSpinner = ({ size }) => {
    return (
        <LottieView
            autoPlay
            source={require("assets/lottie/loader.json")}
            loop
            speed={1.5}
            style={{ width: size, height: size }}
        />
    );
};

export default LoadingSpinner;

