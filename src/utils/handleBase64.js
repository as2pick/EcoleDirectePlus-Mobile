class Base64Handler {
    encode(rawInput) {
        try {
            const utf8Bytes = new TextEncoder().encode(String(rawInput));
            const base64String = globalThis.btoa(String.fromCharCode(...utf8Bytes));
            return base64String;
        } catch (err) {
            return rawInput;
        }
    }

    decode(rawInput) {
        try {
            const binaryString = globalThis.atob(String(rawInput));
            const bytes = Uint8Array.from(binaryString, (char) =>
                char.charCodeAt(0)
            );
            const decoded = new TextDecoder("utf-8").decode(bytes);
            return decoded;
        } catch (err) {
            return rawInput;
        }
    }
}

const base64Handler = new Base64Handler();
export default base64Handler;

