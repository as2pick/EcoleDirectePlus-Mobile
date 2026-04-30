import CryptoJS from "crypto-js";
import Constants from "expo-constants";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import { CONFIG } from "../constants/config";

const { localSecretKeyStoreName, totalTokenExpirationTime } =
    Constants.expoConfig.extra;

/**
 * Generate or get a secure key
 */
export async function getEncryptionKey() {
    try {
        let key = await SecureStore.getItemAsync(localSecretKeyStoreName);

        if (!key) {
            const randomBytes = await Crypto.getRandomBytesAsync(32); // 256 bits = 32 bytes
            const wordArray = CryptoJS.lib.WordArray.create(randomBytes);
            key = wordArray.toString(); // hex string
            await SecureStore.setItemAsync(localSecretKeyStoreName, key);
            console.log("New encryption key generated and stored.");
        } else {
        }

        return key;
    } catch (error) {
        console.error("Error in getEncryptionKey:", error);
        return null;
    }
}

export const payloadHelper = {
    /**
     * Crypt payload with AES-256 + random IV (CBC)
     * @param {Object} payload
     * @returns {Promise<string>} IV + encrypted text (hex)
     */
    encrypt: async ({ connectionToken, userId }) => {
        try {
            const keyHex = await getEncryptionKey();
            if (!keyHex) throw new Error("Missing encryption key");

            const key = CryptoJS.enc.Hex.parse(keyHex);

            const payload = JSON.stringify({
                userId: userId,
                superSecretUserToken: connectionToken,
                creationDate: CONFIG.preciseDateNow,
                expirationDate: moment(CONFIG.preciseDateNow, "YYYY-MM-DD_HH:mm")
                    .add(totalTokenExpirationTime / 60, "minutes")
                    .format("YYYY-MM-DD_HH:mm"),
            });

            // IV generated with expo-crypto for compatibility
            const randomIvBytes = await Crypto.getRandomBytesAsync(16);
            const iv = CryptoJS.lib.WordArray.create(randomIvBytes);

            const encrypted = CryptoJS.AES.encrypt(payload, key, {
                iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });

            const cipherHex =
                iv.toString(CryptoJS.enc.Hex) +
                encrypted.ciphertext.toString(CryptoJS.enc.Hex);

            return cipherHex;
        } catch (error) {
            console.error("Error in payloadHelper.encrypt:", error);
            return null;
        }
    },

    /**
     * Decrypt crypted chain with AES-CBC with IV integrated
     * @param {string} cipherHex
     * @returns {Promise<string|null>}
     */
    decrypt: async ({ cipherHex }) => {
        try {
            if (!cipherHex || cipherHex.length < 32) {
                throw new Error("Invalid cipherHex input");
            }

            const keyHex = await getEncryptionKey();
            if (!keyHex) throw new Error("Missing encryption key");

            const key = CryptoJS.enc.Hex.parse(keyHex);

            const ivHex = cipherHex.slice(0, 32); // 16 bytes IV = 32 hex chars
            const ciphertextHex = cipherHex.slice(32);

            const iv = CryptoJS.enc.Hex.parse(ivHex);
            const ciphertext = CryptoJS.enc.Hex.parse(ciphertextHex);

            const decrypted = CryptoJS.AES.decrypt({ ciphertext }, key, {
                iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });

            const stringPayload = decrypted.toString(CryptoJS.enc.Utf8);
            try {
                const parsedPayload = JSON.parse(stringPayload);
                return parsedPayload;
            } catch (error) {
                throw new Error("Invalid JSON format after decryption");
            }
        } catch (error) {
            console.error("Error in payloadHelper.decrypt:", error);
            return null;
        }
    },
};

