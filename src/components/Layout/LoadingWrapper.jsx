import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import OverLoader from "../Ui/LoadingSpinner/OverLoader";

export default function LoadingWrapper({
    loading,
    setLoading,
    children,
    bgOpacityValue = 0.7,
    annimationStartTiming = 500,
    loaderStyles = {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },
    svgSize = 70,
    minimumLoadingTime = 400,
}) {
    const [showLoader, setShowLoader] = useState(false);
    const [internalLoading, setInternalLoading] = useState(loading);
    const loadingStartTime = useRef(null);

    useEffect(() => {
        if (loading && !loadingStartTime.current) {
            loadingStartTime.current = Date.now();
            setInternalLoading(true);
        }

        if (!loading && loadingStartTime.current) {
            const elapsedTime = Date.now() - loadingStartTime.current;
            const remainingTime = minimumLoadingTime - elapsedTime;

            if (remainingTime > 0) {
                const timer = setTimeout(() => {
                    setInternalLoading(false);
                    loadingStartTime.current = null;
                }, remainingTime);

                return () => clearTimeout(timer);
            } else {
                setInternalLoading(false);
                loadingStartTime.current = null;
            }
        }
    }, [loading, minimumLoadingTime]);

    return (
        <View style={{ flex: 1 }}>
            {!internalLoading && children}
            <OverLoader
                annimationStartTiming={annimationStartTiming}
                bgOpacityValue={bgOpacityValue}
                svgSize={svgSize}
                loaderStyles={loaderStyles}
                triggerStateArr={[internalLoading, setInternalLoading]}
                triggerViewArr={[showLoader, setShowLoader]}
            />
        </View>
    );
}

