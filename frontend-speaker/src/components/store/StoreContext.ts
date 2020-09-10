import React from "react";

export const StoreContext = React.createContext({
    token: null, 
    setToken: () => {}
});