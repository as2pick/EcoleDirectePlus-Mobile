import { getResponseChoices } from "./doubleAuth";

// This function get account datas or start A2F process (and recalled after to get datas)

async function Login(payload) {
    try {
        const fetchLoginData = await fetch(
            `https://api.ecoledirecte.com/v3/login.awp?v=4.69.1`,
            {
                body: `data=${JSON.stringify(payload)}`,
                method: "POST",
                headers: {
                    // "Content-Type": "application/x-www-form-urlencoded",
                    // Host: "api.ecoledirecte.com",
                    // Origin: "https://www.ecoledirecte.com",
                    // Refer: "https://www.ecoledirecte.com",
                    "User-Agent":
                        "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0",
                },
            }
        );
        const loginData = await JSON.parse(await fetchLoginData.text());

        switch (loginData.code) {
            case 200:
                return await loginData;
            case 250:
                return {
                    code: await loginData.code,
                    token: await loginData.token,
                    ...(await getResponseChoices(loginData.token)),
                };

            case 505:
                // error
                console.log("bruh");
                console.log("error on login");
                break;
        }
    } catch (error) {
        console.error("Erreur:", error);
        throw error;
    }
}

export default Login;

