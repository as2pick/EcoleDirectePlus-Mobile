import resolvers, { originName } from "../resolver/resolver";
import { storageServiceStates } from "./storageService";

export default async function apiService({ origin, userToken, extra = null }) {
    if (origin !== "all" && !originName.includes(origin)) return;

    if (origin === "all") {
        console.log(`Start to fetch all routes: ${originName}`);
        originName.map(async (origin) => {
            const resolverFunction = resolvers[origin];
            const data = await resolverFunction({ token: userToken, ...extra });
            await storageServiceStates.setter({
                originKey: origin,
                dataToStore: data,
            });
        });
    } else {
        const resolverFunction = resolvers[origin];
        const result = await resolverFunction({ token: userToken, ...extra });
        await storageServiceStates.setter({
            originKey: origin,
            dataToStore: result,
        });
    }
}

