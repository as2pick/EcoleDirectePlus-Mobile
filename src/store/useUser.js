// import { create } from "zustand";

// const useUser = create((set) => ({
//     user: {
//         name: "Alice",
//         email: "alice@mail.com",
//     },

//     // Met à jour un ou plusieurs champs
//     updateUser: (newData) =>
//         set((state) => ({
//             user: { ...state.user, ...newData },
//         })),
// }));

// export default useUser;

import { create } from "zustand";
const useUsertmp = create(
    // persist(
    (set) => ({
        // user: {
        //     name: "Alice",
        //     email: "alice@mail.com",
        // },
        // // Met à jour un ou plusieurs champs
        // updateUser: (newData) =>
        //     set((state) => ({
        //         user: { ...state.user, ...newData },
        //     })),

        globalUserData: null,

        userAccesToken: null,

        isConnected: false,

        // timetable
        sortedTimetableData: null,

        // grades
        sortedGradesData: null,

        //homeworks
        sortedHomeworksData: null,

        customHomeworksData: [],

        setUserState: (dataOrKey, value) =>
            typeof dataOrKey === "string"
                ? set({ [dataOrKey]: value })
                : set(dataOrKey),
    })
    //     {
    //         name: "user-storage",
    //         storage: createJSONStorage(() => AsyncStorage),
    //     }
    // )
);

export const getUseUsertmp = () => useUsertmp.getState();
export const setUseUsertmp = (data) => useUsertmp.setState(data);

export default useUsertmp;

