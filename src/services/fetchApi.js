import { API } from "../constants/api/api";
import { convertApiResponse } from "./responseUtils";

// GTK=59544e475344566e64484a47637a685857444e6c646a6836616d396c63334e4f4e56426c4d57647959544a5854484e775657396b5a6e6c3564586c764b307074574464464e4770505a575a59634856510d0a5a57564d4d4735494e6d6459656d6c5463545247545445304f55344e436e56574e6d3533556c70314f54597859306476566e4e716545703156576b344d574e686156646e4b32646a525645; secure; samesite=Strict; path=/; domain=ecoledirecte.com

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
        return data;
    } catch (error) {
        console.error("Une erreur est survenue lors de l'appel à fetchApi :", error);
        return null;
    }
}

