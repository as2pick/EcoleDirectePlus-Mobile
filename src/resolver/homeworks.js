import fetchApi from "../services/fetchApi";

export default async function homeworksResolver({ token }) {
    // return "homeworks";
    const homeworksResponse = await fetchApi(
        "https://api.ecoledirecte.com/v3/Eleves/{USER_ID}/cahierdetexte.awp?verbe=get&{API_VERSION}",
        { headers: { "X-Token": token }, method: "POST" }
    );
    return homeworksResponse.data;
}

