import { API } from "../../constants/api/api";
import { useUserStore } from "../../hooks/useUserStore";

export default function storeDatas({
    data,
    token,
}) {
    if (!data) return;

    const isAlreadyFormatted = data && 'name' in data;

    const formattedProfile = isAlreadyFormatted ? data : {
        id: data.id,
        name: data.prenom,
        surname: data.nom,
        sex: data.profile?.sexe || "",
        phone: data.profile?.telPortable || "",
        email: data.email || "",
        schoolName: data.nomEtablissement || "",
        class: {
            libelle: data.profile?.classe?.libelle || "",
            code: data.profile?.classe?.code || "",
        },
    };

    useUserStore.getState().setProfile(formattedProfile);
    useUserStore.getState().setToken(token);
    API.USER_ID = data.id;
}
