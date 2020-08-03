import React from "react";
import "@patternfly/react-core/dist/styles/base.css";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./survey-demo.css";

import { Login } from "./components/login/Login";

const App: React.FunctionComponent = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/login" component={Login}/>
            </Switch>
        </Router>
    )
};

ReactDOM.render(<App/>, document.getElementById("root"));