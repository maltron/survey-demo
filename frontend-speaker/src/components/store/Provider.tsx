import React from "react";
import { StoreContext } from "./StoreContext";
import { useLocalStorage } from "./useStorage";

export const StoreProvider = ({ children }) =>  {
    const [token, setToken] = useLocalStorage('token', '');

    return (
        <StoreContext.Provider value={{token, setToken}}>
            {children}
        </StoreContext.Provider>
    )
}