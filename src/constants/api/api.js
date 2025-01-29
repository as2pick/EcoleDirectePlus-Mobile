import authService from "../../services/login/authService";

export const API = {
    API_VERSION: "4.69.1",
    BASE_URL: "https://api.ecoledirecte.com/v3",
    USER_ID: authService
        .restoreCredentials()
        .then((response) => JSON.parse(response.username).userId),
};

