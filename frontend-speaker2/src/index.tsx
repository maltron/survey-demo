import React from "react";
import ReactDOM from "react-dom";
import "@patternfly/react-core/dist/styles/base.css";
import "./survey-demo.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login } from "@app/Login/Login";
import { ListSurveys } from "@app/ListSurveys/ListSurveys";
import { DriveQuestions } from '@app/DriveQuestions/DriveQuestions';

import { AttendeeSurvey } from "@app/Attendee/Attendee";

const App: React.FunctionComponent = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/main" component={ListSurveys}/>
        <Route exact path="/drive/:survey" 
          render={({ match }) => <DriveQuestions survey={parseInt(match.params.survey)}/>}/>
        <Route exact path="/attendee/:survey" 
            render={ ({ match }) => <AttendeeSurvey survey={parseInt(match.params.survey)}/>}/>
      </Switch>
    </Router>
  )
};


ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
