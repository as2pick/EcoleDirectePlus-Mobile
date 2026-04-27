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

    decodeAndClean(rawInput) {
        try {
            const decoded = this.decode(rawInput);
            // Remove HTML tags
            let cleaned = decoded.replace(/<[^>]*>?/gm, "");
            // Decode HTML entities
            cleaned = this.decodeHTMLEntities(cleaned);
            return cleaned;
        } catch (err) {
            return rawInput;
        }
    }

    decodeHTMLEntities(text) {
        if (!text) return text;
        const entities = {
            "&amp;": "&",
            "&lt;": "<",
            "&gt;": ">",
            "&quot;": '"',
            "&#39;": "'",
            "&apos;": "'",
            "&nbsp;": " ",
            "&iexcl;": "¡",
            "&iquest;": "¿",
            "&euro;": "€",
            "&pound;": "£",
            "&yen;": "¥",
            "&copy;": "©",
            "&reg;": "®",
            "&deg;": "°",
            "&plusmn;": "±",
            "&times;": "x",
            "&divide;": "÷",
            "&middot;": "·",
            "&bull;": "•",
            "&hellip;": "…",
            "&ndash;": "-",
            "&mdash;": "—",
            "&lsquo;": "'",
            "&rsquo;": "'",
            "&ldquo;": '"',
            "&rdquo;": '"',
            "&laquo;": "«",
            "&raquo;": "»",
        };
        let result = text;
        for (const [entity, char] of Object.entries(entities)) {
            result = result.replace(new RegExp(entity.replace(/&/g, "&amp;"), "g"), char);
        }
        // Handle numeric entities: &#123; and &#xAB;
        result = result.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(parseInt(dec, 10)));
        result = result.replace(/&#x([A-Fa-f0-9]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
        return result;
    }
}

const base64Handler = new Base64Handler();
export default base64Handler;

