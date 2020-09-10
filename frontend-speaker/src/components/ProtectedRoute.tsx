import React from "react";
import { Route, Redirect } from "react-router-dom";
import { StoreContext } from "../components/store/StoreContext";

export const ProtectedRoute = ({ component: Component, ...rest}) => {
    const [ token ] = React.useContext(StoreContext);

    return (
        <Route {...rest} render={() => 
            token ? <Component {...rest}/> : <Redirect to="/login"/> }/>
    )
}