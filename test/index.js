import { generateChecksum } from "../src/utils/crypto.js";

const obj = { a: 1, b: 2, c: [3, 4, 5] };
const checksum = await generateChecksum(obj);
console.log(checksum); // Exemple : "a5f7d2b3..."

