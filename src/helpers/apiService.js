import resolvers, { originName } from "../resolver/resolver";
import storageService from "./storageService";

export default async function apiService({
    origin = "default",
    userToken,
    extra = null,
}) {
    if (origin !== "default" && !originName.includes(origin)) return;

    if (origin === "default") {
        originName.map(async (origin) => {
            const resolverFunction = resolvers[origin];
            const data = await resolverFunction({ token: userToken, ...extra });
            await storageService.setter({
                originKey: origin,
                dataToStore: data,
            });
        });
    } else {
        const resolverFunction = resolvers[origin];
        const result = await resolverFunction({ token: userToken, ...extra });
        await storageService.setter({ originKey: origin, dataToStore: result });
    }
}

