export default {
    expo: {
        name: "Ecole Directe Plus",
        slug: "ecoledirecteplus-mobile",
        sdkVersion: "54.0.0",
        extra: {
            localSecretKeyStoreName: process.env.LOCAL_SECRET_KEY_STORE_NAME,
            totalTokenExpirationTime: process.env.TOTAL_TOKEN_EXPIRATION_TIME,
            eas: {
                projectId: "af1bb224-a5bf-4931-971e-8ef02143898f",
            },
        },
        plugins: ["expo-secure-store", "expo-font", "expo-splash-screen"],

        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        platforms: ["android", "ios"],
        splash: {
            image: "./assets/splash-icon.png",
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
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#ffffff",
            },
        },

        owner: "as2pick",
        githubUrl: "https://github.com/as2pick/EcoleDirectePlus-Mobile",
    },
};

