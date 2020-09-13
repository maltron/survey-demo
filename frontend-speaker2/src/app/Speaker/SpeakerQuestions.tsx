import React from 'react';
import {
  PageSection,
  Grid, GridItem,
  Card, CardTitle, CardBody, Divider,
  Button, ButtonVariant,
  Progress, ProgressSize, ProgressMeasureLocation,
  TextContent, Text, TextVariants, 
  Toolbar, ToolbarItem, ToolbarContent, ToolbarItemVariant
} from '@patternfly/react-core';
import { Table, TableHeader, TableBody, IRow } from '@patternfly/react-table';
// import { FilterIcon, TableIcon } from '@patternfly/react-icons';
import { MainPage } from '@app/Shared/MainPage';
import { Question, Attendee, AttendeeStep, turnAttendeeIntoRows } from "@app/Shared/Model"
import { useWebSocket, sendWebSocket, Command, Option 
} from "@app/Backend/SocketCommunication";
import { Wait } from "@app/Shared/Components";

interface SpeakerQuestionsProps {
  survey: number; 
}

interface QuestionProps {
  question: Question | null
  isCurrent?: boolean
}

interface SpeakerSurveyState {
  step: AttendeeStep; 
  loadingQuestions: boolean; 
  currentQuestion: number; 
}

export const SpeakerQuestions: React.FunctionComponent<SpeakerQuestionsProps> = ({ survey }) => {
  const [ connected, websocket ] = useWebSocket();
  const [ state, setState ] = React.useState<SpeakerSurveyState>({
    step: AttendeeStep.started,
    loadingQuestions: true, 
    currentQuestion: 0
  });
  const questions = React.useRef<Array<Question>>([]);
  const [ attendees, setAttendees ] = React.useState<Array<Attendee>>([]);
  // const [ step, setStep ] = React.useState<AttendeeStep>(AttendeeStep.started);
  // const [ loadingQuestions, setLoadingQuestions ] = React.useState<boolean>(true);
  // const [ questions, setQuestions ] = React.useState<Array<Question>>([]);
  // const [ currentQuestion, setCurrentQuestion ] = React.useState<number>(0);
  // const [ attendees, setAttendees ] = React.useState<(IRow | string[])[]>([]);

  React.useEffect(() => {
    console.log(">>> DriveQuestions useEffect()");
    if(connected) {
      console.log(">>> DriveQuestions useEffect() connected");
      websocket.onmessage = websocketMessage;
      // Backend: Start a new Session
      // e.g. { speakerID: 1, surveyID: 2 }
      sendWebSocket(websocket, { name: Option.SpeakerStartSurvey, 
        data: { speakerID: 1, surveyID: survey }})

      sendWebSocket(websocket, { name: Option.AttendeesForSurvey,
        data: { surveyID: survey }});
      // websocket.send(JSON.stringify({ survey: survey, action: "START" }));
    }
  }, [connected]);

  // WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET 
  //    WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET 
  const websocketMessage = (event: MessageEvent) => {
    console.log(">>> websocketMessage: ", event.data);

    var response: Command = JSON.parse(event.data); 
    // Refuse anything not related to this Survey 
    if(survey != parseInt(response.data.surveyID)) return;

    // Receiving Attendees Registration
    if(response.name === Option.AttendeeRegistered || 
        response.name === Option.AttendeeScored) {
      setAttendees(response.data.attendees as Array<Attendee>);
      // setState({ ...state, attendees: response.data });
      // var rows: (IRow | string[])[] = response.data.map(
      //     (rank: Attendee, index: number) => 
      //       ({ cells: [ `#${index+1}`, rank.points, 
      //             rank.firstName, rank.lastName ] }))
      // setAttendees(rows);
    // Receiving Questions for this Survey 
    } else if(response.name == Option.SurveyQuestions) {
      questions.current = response.data.questions.filter(question => question.kind == 0);
      setState({ ...state, loadingQuestions: false });
      // setState({ ...state, loadingQuestions: false, questions });
      // // Select only questions for AttendeeStep.during
      // setQuestions(response.data.questions.filter(question => question.kind == 0));
      // setLoadingQuestions(false);
    // A particular Attendee got the answer right
    // Source: Option.AttendeeScored
    }
  }

  const previousQuestion = (): Question => questions.current[state.currentQuestion-1];
  const currentQuestion = (): Question => questions.current[state.currentQuestion];
  const nextQuestion = (): Question => questions.current[state.currentQuestion+1];  

  const startSurvey = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const question: Question = currentQuestion();
    console.log(`>>> STARTED Question ID: ${question.ID} Question:${question}`);
    sendWebSocket(websocket, { name: Option.SpeakerJumpQuestion, 
      data: { speakerID: survey, surveyID: survey, 
              questionID: question.ID }});
    setState({ ...state, step: AttendeeStep.ready });
    // setStep(AttendeeStep.ready);
  }

  const isFirstQuestion = (): boolean => state.currentQuestion == 0;

  const jumpPreviousQuestion = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if(!isFirstQuestion()) {
      setState(prevState => {
        console.log(`>>> Previous Question ID: ${questions.current[prevState.currentQuestion-1].ID} Question:${questions.current[state.currentQuestion]}`);
        sendWebSocket(websocket, { name: Option.SpeakerJumpQuestion, 
          data: { speakerID: 1, surveyID: survey, 
                  questionID: questions.current[prevState.currentQuestion-1].ID }});
        return { ...state, currentQuestion: prevState.currentQuestion -1 };
      })
      // setCurrentQuestion(prevQuestion => { 
      //   console.log(`>>> Previous Question ID: ${questions[prevQuestion-1].ID} Question:${questions[prevQuestion]}`);
      //   sendBackend(websocket, { name: Option.SpeakerJumpQuestion, 
      //     data: { speakerID: 1, surveyID: survey, 
      //             questionID: questions[prevQuestion-1].ID }});
      //   return prevQuestion-1;
      // });
    }
  }

  const isLastQuestion = (): boolean => state.loadingQuestions ? true : state.currentQuestion == questions.current.length-1;

  const jumpNextQuestion = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if(!isLastQuestion()) {
      setState(prevState => {
        console.log(`>>> [1] Next Question ID: ${questions.current[prevState.currentQuestion+1].ID} Question:${questions.current[state.currentQuestion]}`);
        console.log(questions.current[prevState.currentQuestion+1]);
        sendWebSocket(websocket, { name: Option.SpeakerJumpQuestion, 
          data: { speakerID: survey, surveyID: survey, 
                  questionID: questions.current[prevState.currentQuestion+1].ID }});
        console.log(">>> [2] Next Question: Returning State");
        return { ...state, currentQuestion: prevState.currentQuestion +1 };
      })
        //   setCurrentQuestion(prevQuestion => { 
        //     console.log(`>>> Next Question ID: ${questions[prevQuestion+1].ID} Question:${questions[prevQuestion]}`);
        //     sendBackend(websocket, { name: Option.SpeakerJumpQuestion, 
        //       data: { speakerID: 1, surveyID: survey, 
        //               questionID: questions[prevQuestion+1].ID }});
        //       return prevQuestion+1;
        // });
    }
  }

  const finishSurvey = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const question: Question = currentQuestion();
    console.log(`>>> FINISH Question ID: ${question.ID} Question:${question}`);
    sendWebSocket(websocket, { name: Option.SpeakerFinishSurvey, 
      data: { speakerID: 1, surveyID: survey, 
              questionID: question.ID }});
    setState({ ...state, currentQuestion: 0, step: AttendeeStep.started });
    // setCurrentQuestion(0);
    // setStep(AttendeeStep.started);
  }


  return (
    <MainPage>
      <PageSection variant={connected ? "darker" : "dark"}>
          {connected ? "Connected" : "Disconnected"}
      </PageSection>
      <PageSection>
        <QuestionProgress currentQuestion={state.currentQuestion+1}
                                  total={questions.current.length}/>
      </PageSection>
      <PageSection variant="light">
        <TextContent>
          <Text component={TextVariants.h1}>Capitals of the World</Text>
          <Text component={TextVariants.p}>Examples of how a survey will be shown to the users</Text>
        </TextContent>
        <Toolbar id="toolbar-group-types">
          <ToolbarContent>
            <ToolbarItem>
              <Button isDisabled={state.step != AttendeeStep.started} 
                    variant={ButtonVariant.danger} onClick={startSurvey}>Start</Button>
            </ToolbarItem>
            <ToolbarItem variant={ToolbarItemVariant.separator}/>
            <ToolbarItem>
              <ButtonDrive isDisabled={state.step != AttendeeStep.ready ? true : isFirstQuestion()}
                variant={ButtonVariant.secondary}
                text="Previous" handle={jumpPreviousQuestion}/>
            </ToolbarItem>
            <ToolbarItem>
              <ButtonDrive isDisabled={state.step != AttendeeStep.ready ? true : isLastQuestion()}
                variant={ButtonVariant.primary}
                text="Next" handle={jumpNextQuestion}/>
            </ToolbarItem>
            <ToolbarItem variant={ToolbarItemVariant.separator}/>
            <ToolbarItem>
              <Button isDisabled={state.step != AttendeeStep.ready}
                    variant={ButtonVariant.danger} onClick={finishSurvey}>Finish</Button>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </PageSection>
      <PageSection variant="default">
        <Grid hasGutter>
          { state.loadingQuestions && ( <Wait/>) }
          { !state.loadingQuestions && (
            <React.Fragment>
              <Question question={state.currentQuestion == 0 ? null : previousQuestion()}/>
              <Question isCurrent question={currentQuestion()}/>
              <Question question={state.currentQuestion < questions.current.length ? nextQuestion() : null}/>
            </React.Fragment>
          )}
          <ListOfUsers attendees={attendees}/>
        </Grid>
      </PageSection>
    </MainPage>
  );
};

const QuestionProgress: React.FunctionComponent<{ currentQuestion: number, total: number }> = ({ currentQuestion, total }) => {
  return (
    <Progress min={1} value={currentQuestion} max={total} size={ProgressSize.lg}
      label={`${currentQuestion}/${total}`}
      measureLocation={ProgressMeasureLocation.outside}/>
  )
}

const Question: React.FunctionComponent<QuestionProps> = ({ question, isCurrent }) => {
  return (
    <GridItem span={4}>
      { isCurrent && question && (<Card isSelectable isSelected={true}>
        <CardTitle>{question.question}</CardTitle>
        <CardBody>
          {question.answers.map((answer, index) => (
            <p key={index}>{answer.answer}</p>
          ))}
        </CardBody>
      </Card> )}
      { !isCurrent && question && (<Card>
        <p key="timer">{question.points} points</p>
        <Divider/>
        <CardTitle>{question.question}</CardTitle>
        <CardBody>
          {question.answers.map((answer, index) => (
            <p key={index}>{index+1}. {answer.answer}</p>
          ))}
        </CardBody>
      </Card> )}
    </GridItem>
  );
};

const ListOfUsers: React.FunctionComponent<{ attendees: Array<Attendee> }> = ({ attendees }) => {
  return (
    <GridItem rowSpan={1}>
      <Card>
        <Table
          aria-label="Bulk Select Table Demo"
          cells={[{ title: 'Rank' }, { title: 'Points' }, { title: 'First Name' }, { title: 'Second Name' }]}
          rows={turnAttendeeIntoRows(attendees)}
        >
          <TableHeader />
          <TableBody />
        </Table>
      </Card>
    </GridItem>
  );
};

interface ButtonDriveProps {
  text: string; 
  variant: ButtonVariant;
  isDisabled: boolean;
  handle: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const ButtonDrive: React.FunctionComponent<ButtonDriveProps> = ({ text, variant, isDisabled, handle }) => {

  // React.useEffect(() => {
  //   console.log(`ButtonDrive Text:${text} isDisabled:${isDisabled}`);
  // }, []);

  return (
     isDisabled ? 
      <Button isDisabled variant={variant} onClick={handle}>{text}</Button> :
      <Button variant={variant} onClick={handle}>{text}</Button> 
  )
}