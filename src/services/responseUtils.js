import { splitCookiesString } from "set-cookie-parser";

export const getCookiesFromResponse = (response) => {
    const setCookieHeader = getHeaderFromResponse({ response, item: "set-cookie" });
    if (setCookieHeader === null) return [];

    return splitCookiesString(setCookieHeader).map(
        (cookie) => cookie.split(";")[0]
    )[0];
};

export const getHeaderFromResponse = ({ response, item }) => {
    const headers = response.headers;

    return isHeaderInstance(headers) ? headers.get(item) : item;
};

const isHeaderInstance = (headers) => typeof headers.get === "function";

export const convertApiResponse = async (response) => {
    const stringifyResponse = await response.text();

    if (stringifyResponse) {
        return JSON.parse(stringifyResponse);
    } else {
        return response;
    }
};

