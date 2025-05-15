import CryptoJS from "crypto-js";

// async function getOrCreateEncryptionKey(userId) {
//     const salt = CryptoJS.lib.WordArray.random(128 / 8);

//     const password = CryptoJS.enc.Utf8.parse(userId);

//     const derivedKey = CryptoJS.PBKDF2(password, salt, {
//         keySize: 256 / 32,
//         iterations: 1000,
//     }).toString();

//     const keyToStore = `${CryptoJS.enc.Hex.stringify(salt)}:${derivedKey}`;
//     console.log(salt);
//     console.log(password);
//     console.log(derivedKey);
//     console.log(CryptoJS.lib.WordArray.random(128 / 8).toString());
// }

// getOrCreateEncryptionKey(39347);
console.log(CryptoJS.lib.WordArray.random(256 / 8).toString());

