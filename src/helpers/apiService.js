import resolvers, { originName } from "../resolver/resolver";
import { generateChecksum } from "../utils/crypto";
import { storageServiceStates } from "./storageService";

export default async function apiService({ origin, userToken, extra = null }) {
    if (origin !== "all" && !originName.includes(origin)) return;

    if (origin === "all") {
        const promises = originName.map(async (origin) => {
            try {
                const resolverFunction = resolvers[origin];
                const data = await resolverFunction({ token: userToken, ...extra });
                if (!data) return;
                
                const apiDataChecksum = await generateChecksum(data);
                console.log(apiDataChecksum, "checksum generated for", origin);
                await storageServiceStates.setter({
                    originKey: origin,
                    dataToStore: data,
                });
                await storageServiceStates.setter({
                    originKey: `checksum_${origin}`,
                    dataToStore: apiDataChecksum,
                });
            } catch (error) {
                console.error(`Error in apiService for ${origin}:`, error);
            }
        });

        await Promise.all(promises);
        console.log("All routes fetch attempt completed.");
    } else {
        try {
            const resolverFunction = resolvers[origin];
            const result = await resolverFunction({ token: userToken, ...extra });
            if (!result) return;

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
        } catch (error) {
            console.error(`Error in apiService for ${origin}:`, error);
        }
    }
}

export async function dataUpdater(userToken) {
    const promises = originName.map(async (origin) => {
        try {
            const resolverFunction = resolvers[origin];
            const data = await resolverFunction({ token: userToken });
            const apiChecksum = await generateChecksum(data);
            const storedApiChecksum = await storageServiceStates.getter({
                originKey: `checksum_${origin}`,
            });
            if (apiChecksum !== storedApiChecksum) {
                console.log(`Data out-to-date, updating for ${origin}`);
                apiService({ origin, userToken });
            } else {
                console.log(`Up-to-date data for ${origin}`);
            }
        } catch (error) {
            console.log(
                `Error while refresh API data for origin ${origin} : `,
                error
            );
        }
    });

    await Promise.allSettled(promises);
}

