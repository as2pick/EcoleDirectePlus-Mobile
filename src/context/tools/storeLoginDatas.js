import { API } from "../../constants/api/api";
import { useUserStore } from "../../hooks/useUserStore";

export default function storeDatas({
    data,
    token,
}) {
    useUserStore.getState().setProfile(data);
    useUserStore.getState().setToken(token);
    API.USER_ID = data.id;
}
