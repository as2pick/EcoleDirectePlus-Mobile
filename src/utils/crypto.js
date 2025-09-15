import * as Crypto from "expo-crypto";

export async function generateChecksum(data) {
    const dataString = JSON.stringify(data);
    const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        dataString
    );
    return hash;
}

