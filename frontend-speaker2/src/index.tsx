import React from "react";
import ReactDOM from "react-dom";
import "@patternfly/react-core/dist/styles/base.css";
import "./survey-demo.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login } from "@app/Login/Login";
import { ListSurveys } from "@app/ListSurveys/ListSurveys";
import { DriveQuestions } from '@app/DriveQuestions/DriveQuestions';

const App: React.FunctionComponent = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/main" component={ListSurveys}/>
        <Route exact path="/drive" component={DriveQuestions}/>
      </Switch>
    </Router>
  )
};


ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
