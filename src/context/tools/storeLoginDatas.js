// setUserData.js
import { API } from "../../constants/api/api";
import authService from "../../services/login/authService";
import { useUserStore } from "../../hooks/useUserStore";

export default function storeDatas({
    data,
    token,
}) {
    authService.storeUserData(data);
    useUserStore.getState().setProfile(data);
    useUserStore.getState().setToken(token);
    API.USER_ID = data.id;
}
