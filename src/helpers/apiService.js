import resolvers, { originName } from "../resolver/resolver";
import { generateChecksum } from "../utils/crypto";
import { storageServiceStates } from "./storageService";

export default async function apiService({ origin, userToken, extra = null }) {
    if (origin !== "all" && !originName.includes(origin)) return;

    if (origin === "all") {
        // console.log(`Start to fetch all routes: ${originName}`);
        const promises = originName.map(async (origin) => {
            const resolverFunction = resolvers[origin];
            const data = await resolverFunction({ token: userToken, ...extra });
            const apiDataChecksum = await generateChecksum(data);
            console.log(apiDataChecksum, "checksum generated");
            await storageServiceStates.setter({
                originKey: origin,
                dataToStore: data,
            });
            await storageServiceStates.setter({
                originKey: `checksum_${origin}`,
                dataToStore: apiDataChecksum,
            });
            return;
        });

        await Promise.all(promises);
        console.log("All routes fetched and stored.");
    } else {
        const resolverFunction = resolvers[origin];
        const result = await resolverFunction({ token: userToken, ...extra });
        const apiDataChecksum = await generateChecksum(result);

        await storageServiceStates.setter({
            originKey: origin,
            dataToStore: result,
        });
        await storageServiceStates.setter({
            originKey: `checksum_${origin}`,
            dataToStore: apiDataChecksum,
        });

        console.log(`Route ${origin} fetched and stored.`);
    }
}

export async function dataUpdater(userToken) {
    const promises = originName.map(async (origin) => {
        const resolverFunction = resolvers[origin];
        const data = await resolverFunction({ token: userToken });
        const storedApiChecksum = await storageServiceStates.getter({
            originKey: `checksum_${origin}`,
        });
        console.log(storedApiChecksum);
    });

    await Promise.all(promises);
}

