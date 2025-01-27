export default async function fetchApi(url, requestPayload = {}) {
    try {
        const defaultHeaders = {
            "User-Agent":
                "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0",
        };
        // Construction de la configuration de la requête
        const requestConfig = {
            ...requestPayload,
            headers: {
                ...defaultHeaders,
                ...(requestPayload.headers || {}),
            },
            body:
                "body" in requestPayload
                    ? `data=${JSON.stringify(requestPayload.body)}`
                    : "data={}",
        };
        // Appel principal à l'API
        const apiResponse = await fetch(url, requestConfig);

        if (!apiResponse.ok) {
            throw new Error(
                `HTTP Error: ${apiResponse.status} - ${apiResponse.statusText}`
            );
        }

        const data = await apiResponse.json();

        return data;
    } catch (error) {
        console.error(
            "Une erreur est survenue lors de l'appel à fetchApi :",
            error.message
        );
        return null;
    }
}

