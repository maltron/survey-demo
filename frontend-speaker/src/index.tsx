import React from "react";
import "@patternfly/react-core/dist/styles/base.css";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./survey-demo.css";

import { StoreProvider } from "./components/store/Provider";
import { Login } from "./components/login/Login";
import { Menu } from "./components/main/Menu";

const App: React.FunctionComponent = () => {
  return (
    <Router>
      <StoreProvider>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/menu" component={Menu}/>
        </Switch>
      </StoreProvider>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
