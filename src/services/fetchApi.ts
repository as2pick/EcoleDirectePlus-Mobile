import { API } from "@/constants/api/api";
import { useUserStore } from "@/hooks/useUserStore";
import { convertApiResponse } from "./responseUtils";

export default async function fetchApi<T>(
    url: string,
    requestPayload?: { headers?: any; body?: any; method?: string }
): Promise<T> {
    try {
        const token = requestPayload?.headers?.["X-Token"] || useUserStore.getState().token;

        if (token === "guest_token") {
            const { getGuestData } = require("./guestData");
            const response = getGuestData(url, requestPayload?.body);
            return {
                ...response,
                isDataEmpty: !response || !response.data,
                responseHeaders: {},
            } as any;
        }

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
        const userId = useUserStore.getState().profile?.id;
        url =
            url.includes("{USER_ID}") && userId != null
                ? url.replace("{USER_ID}", String(userId))
                : url;

        const apiResponse = await fetch(url, requestConfig);
        if (!apiResponse.ok) {
            throw new Error(
                `HTTP Error: ${apiResponse.status} - ${apiResponse.statusText}`
            );
        }

        const data = await convertApiResponse(apiResponse);

        const isDataEmpty =
            JSON.stringify(data.data) === "{}" || JSON.stringify(data.data) === "[]";

        return {
            ...data,
            isDataEmpty,
            responseHeaders: (apiResponse.headers as any).map,
        } as T;
    } catch (error) {
        console.error("Une erreur est survenue lors de l'appel à fetchApi :", error);
        return null;
    }
}
