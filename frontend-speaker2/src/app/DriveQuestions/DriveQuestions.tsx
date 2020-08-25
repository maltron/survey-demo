import React from 'react';
import {
  PageSection,
  Grid,
  GridItem,
  Card,
  CardTitle,
  CardBody,
  Divider,
  Button,
  TextContent,
  Text,
  TextVariants,
  Toolbar,
  ToolbarItem,
  OverflowMenu,
  OverflowMenuItem,
  OverflowMenuControl,
  Dropdown,
  KebabToggle,
  OverflowMenuContent,
  ButtonVariant,
  OverflowMenuGroup,
  ToolbarContent,
  EmptyState, EmptyStateIcon, Title
} from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { FilterIcon, TableIcon } from '@patternfly/react-icons';
import { MainPage } from '@app/Shared/MainPage';
import { Question } from "@app/Shared/Model"
import { useWebSocket } from "@app/Backend/SocketCommunication";
import { Wait } from "@app/Shared/Components";
import { useAPIRank, useAPIQuestions } from "@app/Backend/APIReqquest";

interface DriveQuestionsProps {
  survey: number; 
}

interface QuestionProps {
  question: Question | null
  isCurrent?: boolean
}

export const DriveQuestions: React.FunctionComponent<DriveQuestionsProps> = ({ survey }) => {
  const [ connected, websocket ] = useWebSocket();
  const [ loading, questions ] = useAPIQuestions(survey); // Setting to 
  const [ currentQuestion, setCurrentQuestion ] = React.useState<number>(0);

  React.useEffect(() => {
    console.log(">>> DriveQuestions useEffect()");
    if(connected) {
      console.log(">>> DriveQuestions useEffect() connected");
      websocket.onmessage = backendMessage;
      // websocket.send(JSON.stringify({ survey: survey, action: "START" }));
    }
  }, [connected]);

  const backendMessage = (event: MessageEvent) => {
          console.log(`>>> backendMessage(): ${event.data} ${event.lastEventId} ${event.origin} ${event.ports} ${event.source}`);
  }

  const isFirstQuestion = (): boolean => currentQuestion == 0;

  const jumpPreviousQuestion = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if(!isFirstQuestion()) {
      setCurrentQuestion(prevQuestion => { 
          notifyBackend(questions[prevQuestion-1].ID);
          return prevQuestion-1;
      });
    }
  }

  const buttonPrevious: JSX.Element = (
    isFirstQuestion() ? 
    <Button isDisabled variant={ButtonVariant.secondary} onClick={jumpPreviousQuestion}>Previous</Button>
    : <Button variant={ButtonVariant.secondary} onClick={jumpPreviousQuestion}>Previous</Button>
  )

  const isLastQuestion = (): boolean => currentQuestion == questions.length-1;

  const jumpNextQuestion = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if(!isLastQuestion()) {
        setCurrentQuestion(prevQuestion => { 
            notifyBackend(questions[prevQuestion+1].ID);
            return prevQuestion+1;
        });
    }
  }

  const buttonNext: JSX.Element = (
    isLastQuestion() ? 
    <Button isDisabled variant={ButtonVariant.primary} onClick={jumpNextQuestion}>Next</Button>
    : <Button variant={ButtonVariant.primary} onClick={jumpNextQuestion}>Next</Button>
  )

  const notifyBackend = (questionID: number) => {
    console.log("notifyBackground Connected:"+connected);
    if(connected) {
      websocket.send(JSON.stringify({ surveyID: 1, questionID }));
    }
  }

  return (
    <MainPage>
      { connected ? <PageSection variant="darker">Connected</PageSection>
                  : <PageSection variant="dark">Disconnected</PageSection> }
      <PageSection variant="light">
        <TextContent>
          <Text component={TextVariants.h1}>Capitals of the World</Text>
          <Text component={TextVariants.p}>Examples of how a survey will be shown to the users</Text>
        </TextContent>
        <Toolbar id="toolbar-group-types">
          <ToolbarContent>
            <ToolbarItem>{buttonPrevious}</ToolbarItem>
            <ToolbarItem>{buttonNext}</ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </PageSection>
      <PageSection variant="default">
        <Grid hasGutter>
          { !loading && (
            <React.Fragment>
              <Question question={currentQuestion == 0 ? null : questions[currentQuestion-1]}/>
              <Question isCurrent question={questions[currentQuestion]}/>
              <Question question={currentQuestion < questions.length ? questions[currentQuestion+1] : null}/>
            </React.Fragment>
          )}
          <ListOfUsers survey={survey}/>
        </Grid>
      </PageSection>
    </MainPage>
  );
};

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

const ListOfUsers: React.FunctionComponent<DriveQuestionsProps> = ({ survey }) => {
  const [ loading, ranks ] = useAPIRank(survey);

  const rows = () => { 
    const result = ranks.map((rank, index) => ({ cells: [ `#${index}`, rank.points, rank.firstName, rank.lastName ] }));
    console.log(result);
  }

  return (
    <GridItem rowSpan={1}>
      <Card>
        {loading && (<Wait/>)}
        {!loading && (<Table
          aria-label="Bulk Select Table Demo"
          cells={[{ title: 'Rank' }, { title: 'Points' }, { title: 'First Name' }, { title: 'Second Name' }]}
          // rows={ranks.map((rank, index) => {
          //   { cells: [ `#${index}`, `${rank.points}`, `${rank.firstName}`, `${rank.lastName}` ]}
          // })}
          rows={ranks.map((rank, index) => ({ cells: [ `#${index+1}`, rank.points, rank.firstName, rank.lastName ] }))}
          onSelect={(OnSelect) => {

            rows();
          }}
        >
          <TableHeader />
          <TableBody />
        </Table>
        )}
      </Card>
    </GridItem>
  );
};
