import React from 'react';
import {
  PageSection,
  Grid, GridItem,
  Card, CardTitle, CardBody, Divider,
  Button, ButtonVariant,
  Progress, ProgressSize, ProgressVariant, ProgressMeasureLocation,
  TextContent, Text, TextVariants, 
  Toolbar, ToolbarItem, ToolbarContent, ToolbarItemVariant
} from '@patternfly/react-core';
import { Table, TableHeader, TableBody, IRow } from '@patternfly/react-table';
// import { FilterIcon, TableIcon } from '@patternfly/react-icons';
import { MainPage } from '@app/Shared/MainPage';
import { Question, Attendee } from "@app/Shared/Model"
import { useWebSocket, sendBackend, 
         Command, Option, SpeakerForSurvey } from "@app/Backend/SocketCommunication";
import { Wait } from "@app/Shared/Components";

interface SpeakerQuestionsProps {
  survey: number; 
}

interface QuestionProps {
  question: Question | null
  isCurrent?: boolean
}

export const SpeakerQuestions: React.FunctionComponent<SpeakerQuestionsProps> = ({ survey }) => {
  const [ started, setStarted ] = React.useState<boolean>(false);
  const [ connected, websocket ] = useWebSocket();
  const [ loadingQuestions, setLoadingQuestions ] = React.useState<boolean>(true);
  const [ questions, setQuestions ] = React.useState<Array<Question>>([]);
  const [ currentQuestion, setCurrentQuestion ] = React.useState<number>(0);
  const [ attendees, setAttendees ] = React.useState<(IRow | string[])[]>([]);

  React.useEffect(() => {
    console.log(">>> DriveQuestions useEffect()");
    if(connected) {
      console.log(">>> DriveQuestions useEffect() connected");
      websocket.onmessage = backendMessage;
      // Backend: Start a new Session
      // e.g. { speakerID: 1, surveyID: 2 }
      sendBackend(websocket, { name: Option.SpeakerStartSurvey, 
        data: { speakerID: 1, surveyID: survey }})
      // websocket.send(JSON.stringify({ survey: survey, action: "START" }));
    }
  }, [connected]);

  // WEBSOCKET: Receveing Messages from Backend
  const backendMessage = (event: MessageEvent) => {
    // console.log(">>> backedMessage: ", event.data);
    var response: Command = JSON.parse(event.data); 
    // Receiving Attendees Registration
    if(response.name === Option.Attendees) {
      var rows: (IRow | string[])[] = response.data.map((rank: Attendee, index: number) => ({ cells: [ `#${index+1}`, rank.points, rank.firstName, rank.lastName ] }))
      setAttendees(rows);
    // Receiving Questions for this Survey 
    } else if(response.name == Option.SurveyQuestions) {
      setQuestions(response.data);
      setLoadingQuestions(false);
    }
  }

  const startSurvey = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log(`>>> STARTED Question ID: ${questions[currentQuestion].ID} Question:${questions[currentQuestion]}`);
    sendBackend(websocket, { name: Option.SpeakerJumpQuestion, 
      data: { speakerID: 1, surveyID: survey, 
              questionID: questions[currentQuestion].ID }});
    setStarted(true);
  }

  const isFirstQuestion = (): boolean => currentQuestion == 0;

  const jumpPreviousQuestion = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if(!isFirstQuestion()) {
      setCurrentQuestion(prevQuestion => { 
        console.log(`>>> Previous Question ID: ${questions[prevQuestion-1].ID} Question:${questions[prevQuestion]}`);
        sendBackend(websocket, { name: Option.SpeakerJumpQuestion, 
          data: { speakerID: 1, surveyID: survey, 
                  questionID: questions[prevQuestion-1].ID }});
        return prevQuestion-1;
      });
    }
  }

  const isLastQuestion = (): boolean => loadingQuestions ? true : currentQuestion == questions.length-1;

  const jumpNextQuestion = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if(!isLastQuestion()) {
          setCurrentQuestion(prevQuestion => { 
            console.log(`>>> Next Question ID: ${questions[prevQuestion+1].ID} Question:${questions[prevQuestion]}`);
            sendBackend(websocket, { name: Option.SpeakerJumpQuestion, 
              data: { speakerID: 1, surveyID: survey, 
                      questionID: questions[prevQuestion+1].ID }});
              return prevQuestion+1;
        });
    }
  }

  return (
    <MainPage>
      { connected ? <PageSection variant="darker">Connected</PageSection>
                  : <PageSection variant="dark">Disconnected</PageSection> }
      <PageSection>
        <QuestionProgress currentQuestion={currentQuestion+1}
                                  total={questions.length}/>
      </PageSection>
      <PageSection variant="light">
        <TextContent>
          <Text component={TextVariants.h1}>Capitals of the World</Text>
          <Text component={TextVariants.p}>Examples of how a survey will be shown to the users</Text>
        </TextContent>
        <Toolbar id="toolbar-group-types">
          <ToolbarContent>
            <ToolbarItem>
              {!started ? <Button variant={ButtonVariant.danger} 
                onClick={startSurvey}>Start</Button>
                : <Button isDisabled variant={ButtonVariant.primary}>Start</Button>
              }
            </ToolbarItem>
            <ToolbarItem variant={ToolbarItemVariant.separator}/>
            <ToolbarItem>
              <ButtonDrive isDisabled={!started ? true : isFirstQuestion()}  
                variant={ButtonVariant.secondary}
                text="Previous" handle={jumpPreviousQuestion}/>
            </ToolbarItem>
            <ToolbarItem>
              <ButtonDrive isDisabled={!started ? true : isLastQuestion()}
                variant={ButtonVariant.primary}
                text="Next" handle={jumpNextQuestion}/>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </PageSection>
      <PageSection variant="default">
        <Grid hasGutter>
          { loadingQuestions && ( <Wait/>) }
          { !loadingQuestions && (
            <React.Fragment>
              <Question question={currentQuestion == 0 ? null : questions[currentQuestion-1]}/>
              <Question isCurrent question={questions[currentQuestion]}/>
              <Question question={currentQuestion < questions.length ? questions[currentQuestion+1] : null}/>
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

const ListOfUsers: React.FunctionComponent<{ attendees: (IRow | string[])[] }> = ({ attendees }) => {

  // const rows = () => { 
  //   const result = attendees.map((rank, index) => ({ cells: [ `#${index}`, rank.points, rank.firstName, rank.lastName ] }));
  //   console.log(result);
  // }

  return (
    <GridItem rowSpan={1}>
      <Card>
        <Table
          aria-label="Bulk Select Table Demo"
          cells={[{ title: 'Rank' }, { title: 'Points' }, { title: 'First Name' }, { title: 'Second Name' }]}
          rows={attendees}
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

  React.useEffect(() => {
    console.log(`ButtonDrive Text:${text} isDisabled:${isDisabled}`);
  }, []);

  return (
     isDisabled ? 
      <Button isDisabled variant={variant} onClick={handle}>{text}</Button> :
      <Button variant={variant} onClick={handle}>{text}</Button> 
  )
}