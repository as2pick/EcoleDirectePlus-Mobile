import { createContext, useContext, useMemo, useReducer } from "react";

const HomeworksContext = createContext();

const defaultState = {
    homeworksData: null,
    toggle: null,
    new: { modalOpen: null, discipline: null, id: null, date: null, content: null },
};

const homeworksReducer = (state, action) => {
    switch (action.type) {
        case "SEE_HOMEWORK_DETAILS":
            return { ...state, homeworksData: action.payload };
        case "RESET_HOMEWORK_DETAILS":
            return { ...state, homeworksData: null };
        case "TOGGLE_HOMEWORK":
            return { ...state, toggle: action.payload };
        case "OPEN_NEW_HOMEWORK_MODAL":
            return {
                ...state,
                new: { modalOpen: true },
            };
        case "CLOSE_NEW_HOMEWORK_MODAL":
            return { ...state, new: { modalOpen: false } };
        case "CREATE_NEW_HOMEWORK":
            return { ...state, new: { ...action.payload, modalOpen: false } }; // discipline (int), date (YYYY-MM-DD), content (int)
        case "RESET":
            return defaultState;
        default:
            return state;
    }
};

export const HomeworksProvider = ({ children }) => {
    const [state, dispatch] = useReducer(homeworksReducer, defaultState);
    const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

    return (
        <HomeworksContext.Provider value={contextValue}>
            {children}
        </HomeworksContext.Provider>
    );
};

export const useHomework = () => useContext(HomeworksContext);

