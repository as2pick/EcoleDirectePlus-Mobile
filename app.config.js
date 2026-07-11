export default {
    expo: {
        name: "Ecole Directe Plus",
        slug: "ecoledirecteplus-mobile",
        sdkVersion: "54.0.0",
        extra: {
            eas: {
                projectId: "9b9101a7-7d93-4cd9-b9ba-d3149e8b3401",
            },
        },
        scheme: "ecoledirecteplus",
        plugins: ["expo-dev-client", "expo-secure-store", "expo-font", "expo-splash-screen"],

        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icons/icon.png",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        platforms: ["android", "ios"],
        splash: {
            image: "./assets/icons/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.as2pick.EcoleDirectePlusMobileEPO",
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
            },
        },
        android: {
            package: "com.as2pick.ecoledirecteplus",
            adaptiveIcon: {
                foregroundImage: "./assets/icons/adaptive-icon.png",
                backgroundColor: "#ffffff",
            },
        },

        owner: "as2pick",
        githubUrl: "https://github.com/as2pick/EcoleDirectePlus-Mobile",
    },
};

