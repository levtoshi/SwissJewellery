import { useEffect, useReducer } from "react";
import toast from "react-hot-toast";

function useLocalStorageReducer(key, reducer, initialState) {
    const [state, dispatch] = useReducer(
        reducer,
        initialState,
        (init) => {
            try {
                const saved = localStorage.getItem(key);
                if (saved && saved !== "undefined") {
                    return JSON.parse(saved);
                }
            } catch (error) {
                toast.error(`Error reading from localStorage ${error}`);
            }
            return init;
        }
    );

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            toast.error(`Error saving to localStorage ${error}`);
        }
    }, [key, state]);

    return [state, dispatch];
}

export default useLocalStorageReducer;