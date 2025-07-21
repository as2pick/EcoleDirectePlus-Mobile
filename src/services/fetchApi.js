import { API } from "../constants/api/api";
import { convertApiResponse } from "./responseUtils";

export default async function fetchApi(
    url,
    requestPayload = { headers, body, method }
) {
    try {
        const defaultHeaders = {
            "User-Agent": `Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0`,
        };

        const reqMethod = requestPayload?.method;
        const reqBody =
            reqMethod !== "GET"
                ? requestPayload?.body
                    ? `data=${JSON.stringify(requestPayload?.body)}`
                    : "data={}"
                : null;
        const requestConfig = {
            ...requestPayload,
            headers: {
                ...defaultHeaders,
                ...(requestPayload?.headers || {}),
            },
            body: reqBody,
            method: reqMethod,
        };

        url = url.includes("{API_VERSION}")
            ? url.replace("{API_VERSION}", `v=${API.API_VERSION}`)
            : url;
        url =
            url.includes("{USER_ID}") && API.USER_ID != null
                ? url.replace("{USER_ID}", API.USER_ID)
                : url;

        const apiResponse = await fetch(url, requestConfig);

        if (!apiResponse.ok) {
            throw new Error(
                `HTTP Error: ${apiResponse.status} - ${apiResponse.statusText}`
            );
        }

        const data = await convertApiResponse(apiResponse);

        if (
            JSON.stringify(data.data) === "{}" ||
            JSON.stringify(data.data) === "[]"
        ) {
            return null;
        }

        return data;
    } catch (error) {
        console.error("Une erreur est survenue lors de l'appel à fetchApi :", error);
        return null;
    }
}

