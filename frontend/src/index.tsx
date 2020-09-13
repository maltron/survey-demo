import React from "react";
import ReactDOM from "react-dom";
import "@patternfly/react-core/dist/styles/base.css";
import "./survey-demo.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login } from "@app/Login/Login";
import { ListSurveys } from "@app/ListSurveys/ListSurveys";
import { SpeakerQuestions } from '@app/Speaker/SpeakerQuestions';
import { Ranking } from "@app/Ranking/Ranking";
import { AttendeeSurvey } from "@app/Attendee/Attendee";
// import { SpeakerContext, AttendeeContext } from "@app/Shared/Context";
import { AttendeeSessionProvider } from "@app/Attendee/AttendeeContext";

const App: React.FunctionComponent = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/main" component={ListSurveys}/>
        <Route exact path="/rank/:survey"
          render={({ match }) => <Ranking survey={parseInt(match.params.survey)}/>}/>
        <Route exact path="/speaker/:survey" 
          render={({ match }) => <SpeakerQuestions survey={parseInt(match.params.survey)}/>}/>
        <AttendeeSessionProvider>
          <Route exact path="/attendee/:survey" 
            render={ ({ match }) => <AttendeeSurvey survey={parseInt(match.params.survey)}/>}/>
        </AttendeeSessionProvider>
      </Switch>
    </Router>
  )
};


ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
