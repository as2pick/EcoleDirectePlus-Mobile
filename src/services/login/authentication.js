import fetchApi from "../fetchApi.js";

// This function get account datas or start A2F process (and recalled after to get datas)

async function Login(payload) {
    try {
        const fetchLoginData = await fetchApi(
            `https://api.ecoledirecte.com/v3/login.awp?{API_VERSION}`,
            {
                body: payload,
                method: "POST",
            }
        );
        const loginData = await fetchLoginData;
        return loginData;
    } catch (error) {
        console.error("Erreur:", error);
        throw error;
    }
}

export default Login;

