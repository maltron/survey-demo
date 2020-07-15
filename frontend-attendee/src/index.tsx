import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "@patternfly/react-core/dist/styles/base.css";
import { Page } from "@patternfly/react-core";

import "./survey-demo.css";
import { Register } from "./register";

const App: React.FunctionComponent = () => (
    <Router>
        <Page>
            <Register/>
        </Page>
    </Router>
)

ReactDOM.render(<App/>, document.getElementById("root"));