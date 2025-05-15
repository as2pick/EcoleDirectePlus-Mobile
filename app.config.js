import "dotenv/config";

export default {
    expo: {
        name: "Ecole Directe Plus",
        slug: "ecoledirecteplus-mobile",
        extra: {
            localSecretKeyStoreName: process.env.LOCAL_SECRET_KEY_STORE_NAME,
            totalTokenExpirationTime: process.env.TOTAL_TOKEN_EXPIRATION_TIME,
        },
    },
};

