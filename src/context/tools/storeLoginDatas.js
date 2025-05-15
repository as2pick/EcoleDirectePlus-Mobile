// setUserData.js
import { API } from "../../constants/api/api";
import authService from "../../services/login/authService";

export default function storeDatas({
    data,
    token,
    setGlobalUserData,
    setUserAccesToken,
    setIsConnected,
}) {
    setGlobalUserData(data);
    setUserAccesToken(token);
    API.USER_ID = data.id;
    setIsConnected(true);
    authService.storeUserData(data);
}

