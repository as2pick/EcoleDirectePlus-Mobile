import resolvers, { originName } from "../resolver/resolver";
import { storageServiceStates } from "./storageService";

export default async function apiService({ origin, userToken, extra = null }) {
    if (origin !== "all" && !originName.includes(origin)) return;

    if (origin === "all") {
        console.log(`Start to fetch all routes: ${originName}`);
        const promises = originName.map(async (origin) => {
            const resolverFunction = resolvers[origin];
            const data = await resolverFunction({ token: userToken, ...extra });
            return storageServiceStates
                .setter({
                    originKey: origin,
                    dataToStore: data,
                })
                .finally(() => console.log("stored"));
        });

        await Promise.all(promises);
        console.log("All routes fetched and stored.");
    } else {
        const resolverFunction = resolvers[origin];
        const result = await resolverFunction({ token: userToken, ...extra });
        await storageServiceStates.setter({
            originKey: origin,
            dataToStore: result,
        });
        console.log("Route fetched and stored.");
    }
}

