import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import '@patternfly/react-core/dist/styles/base.css';
import { Page } from '@patternfly/react-core';

import './survey-demo.css';
import { Register } from './register';
import { Question } from './survey';
import { Echo } from "./example-websocket";

const App: React.FunctionComponent = () => (
  <Router>
    <Page>
      <Switch>
        <Route exact path="/" component={Register} />
        <Route exact path="/echo" component={Echo} />
        <Route exact path="/survey" component={
            <Question
              question="What is the capital of China ?"
              timer={10}
              points={50}
              answers={[
                { id: '0', answer: 'Shanghai', is_correct: false },
                { id: '1', answer: 'Beijing', is_correct: true },
                { id: '2', answer: 'Tokyo', is_correct: false },
                { id: '3', answer: 'Manchuria', is_correct: false },
              ]}
            />
          }
        />
      </Switch>
    </Page>
  </Router>
);

ReactDOM.render(<App />, document.getElementById('root'));
