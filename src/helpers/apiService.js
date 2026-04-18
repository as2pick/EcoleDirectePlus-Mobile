import useUserDatas from "../hooks/useUserDatas";
import resolvers, { originName } from "../resolver/resolver";
import { generateChecksum } from "../utils/crypto";

export default async function apiService({ origin, userToken, extra = null }) {
    if (origin !== "all" && !originName.includes(origin)) return;

    if (origin === "all") {
        const promises = originName.map(async (origin) => {
            const resolverFunction = resolvers[origin];
            const data = await resolverFunction({ token: userToken, ...extra });
            await useUserDatas.getState().updateDataAndChecksum(origin, data);
        });

        await Promise.all(promises);
        console.log("All routes fetched and stored.");
    } else {
        const resolverFunction = resolvers[origin];
        const result = await resolverFunction({ token: userToken, ...extra });
        await useUserDatas.getState().updateDataAndChecksum(origin, result);

        console.log(`Route ${origin} fetched and stored.`);
    }
}
//  LOG  Data out-to-date, updating for homeworks quand on coche, faudrait éviter ca !!! QUE QUAND ON CHOCHE, quand on décoche ca refetch pas

export async function dataUpdater(userToken) {
    const promises = originName.map(async (origin) => {
        try {
            const resolverFunction = resolvers[origin];
            const data = await resolverFunction({ token: userToken });
            const apiChecksum = await generateChecksum(data);

            const storedApiChecksum = await useUserDatas.getState()[origin].hash;
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

