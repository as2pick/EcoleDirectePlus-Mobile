import { decode, encode } from "base-64";

class base64Handler {
    encode(rawInput) {
        const utf8String = unescape(encodeURIComponent(String(rawInput)));
        return encode(utf8String);
    }
    decode(rawInput) {
        const decodedString = decode(String(rawInput));
        return decodeURIComponent(escape(decodedString));
    }
}

const handleBase64 = new base64Handler();

export default handleBase64;

