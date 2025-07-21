import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../../context/UserContext";
import { storageServiceStates } from "../../../helpers/storageService";
import { routesNames } from "../../../router/config/routesNames";

export default function GradesContent() {
    const { sortedGradesData, setSortedGradesData, userAccesToken } = useUser();
    const {
        client: {
            grades: { content, details, group },
        },
    } = routesNames;

    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [periodes, setPeriodes] = useState([]);
    const [displayPeriode, setDisplayPeriode] = useState({});
    // DropDownPicker
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [periodeItems, setPeriodeItems] = useState([]);

    useFocusEffect(
        useCallback(() => {
            if (!sortedGradesData || Object.keys(sortedGradesData).length === 0) {
                setLoading(true);
                storageServiceStates
                    .getter({ originKey: "grades" })
                    .then((userGrades) => {
                        setSortedGradesData(userGrades);
                        setPeriodes(userGrades.map((period) => period.name));

                        setLoading(false);
                    })
                    .catch((err) => {
                        setError(err.message);
                        setLoading(false);
                    });
            }
        }, [userAccesToken, sortedGradesData])
    );

    useEffect(() => {
        console.log(sortedGradesData);
    }, [sortedGradesData]);

    return <SafeAreaView></SafeAreaView>;
}

