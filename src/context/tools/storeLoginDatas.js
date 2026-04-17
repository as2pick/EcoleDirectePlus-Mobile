// setUserData.js
import { API } from "../../constants/api/api";
import authService from "../../services/login/authService";
import { getUseUsertmp, setUseUsertmp } from "../../store/useUser";

export default function storeDatas({
    data,
    token,
    setGlobalUserData, // r
    setUserAccesToken, // r
    setIsConnected, // r
}) {
    setUseUsertmp({
        globalUserData: data,
        userAccesToken: token,
        isConnected: true,
    });

    setGlobalUserData(data); // r
    setUserAccesToken(token); // r
    API.USER_ID = data.id;
    setIsConnected(true); // r
    authService.storeUserData(data);

    // to get the live value of globalUserData you need to do getUseUsertmp().globalUserData
    console.log(getUseUsertmp().userAccesToken);
}

