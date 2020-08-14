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
} from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { FilterIcon, TableIcon } from '@patternfly/react-icons';
import { MainPage } from '@app/Shared/MainPage';
import { Question, QuestionProps } from '@app/Question/Question';
import { useAPIUsers } from "@app/Backend/APIReqquest";

export const DriveQuestions: React.FunctionComponent = () => {
  const sampleQuestion = (
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
  );
  return (
    <MainPage>
      <PageSection variant="light">
        <TextContent>
          <Text component={TextVariants.h1}>Capitals of the World</Text>
          <Text component={TextVariants.p}>Examples of how a survey will be shown to the users</Text>
        </TextContent>
        <Toolbar id="toolbar-group-types">
          <ToolbarContent>
            <ToolbarItem>
              <Button variant={ButtonVariant.tertiary}>Pick Player</Button>
            </ToolbarItem>
            <ToolbarItem variant="separator" />
            <ToolbarItem>
              <Button variant={ButtonVariant.secondary}>Previous</Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button variant={ButtonVariant.primary}>Next</Button>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </PageSection>
      <PageSection variant="default">
        <Grid hasGutter>
          <PreviousQuestion
            question="What is the capital of Bolivia ?"
            timer={10}
            points={50}
            answers={[
              { id: '0', answer: 'Macau', is_correct: false },
              { id: '1', answer: 'Santiago', is_correct: false },
              { id: '2', answer: 'Lima', is_correct: true },
              { id: '3', answer: 'Cincinatti', is_correct: false },
            ]}
          />
          <CurrentQuestion
            question="What is the capital of Bolivia ?"
            timer={10}
            points={50}
            answers={[
              { id: '0', answer: 'Macau', is_correct: false },
              { id: '1', answer: 'Santiago', is_correct: false },
              { id: '2', answer: 'Lima', is_correct: true },
              { id: '3', answer: 'Cincinatti', is_correct: false },
            ]}
          />
          <NextQuestion
            question="What is the capital of Bolivia ?"
            timer={10}
            points={50}
            answers={[
              { id: '0', answer: 'Macau', is_correct: false },
              { id: '1', answer: 'Santiago', is_correct: false },
              { id: '2', answer: 'Lima', is_correct: true },
              { id: '3', answer: 'Cincinatti', is_correct: false },
            ]}
          />
          <ListOfUsers />
        </Grid>
      </PageSection>
    </MainPage>
  );
};

const PreviousQuestion: React.FunctionComponent<QuestionProps> = ({ question, answers }) => {
  return (
    <GridItem span={4}>
      <Card>
        <CardTitle>{question}</CardTitle>
        <CardBody>
          {answers.map((answer, index) => (
            <p key={index}>{answer.answer}</p>
          ))}
        </CardBody>
      </Card>
    </GridItem>
  );
};

const CurrentQuestion: React.FunctionComponent<QuestionProps> = ({ question, answers }) => {
  return (
    <GridItem span={4}>
      <Card isSelectable isSelected={true}>
        <CardTitle>{question}</CardTitle>
        <CardBody>
          {answers.map((answer, index) => (
            <p key={index}>{answer.answer}</p>
          ))}
        </CardBody>
      </Card>
    </GridItem>
  );
};

const NextQuestion: React.FunctionComponent<QuestionProps> = ({ question, answers }) => {
  return (
    <GridItem span={4}>
      <Card>
        <CardTitle>{question}</CardTitle>
        <CardBody>
          {answers.map((answer, index) => (
            <p key={index}>{answer.answer}</p>
          ))}
        </CardBody>
      </Card>
    </GridItem>
  );
};

const ListOfUsers: React.FunctionComponent = () => {
  return (
    <GridItem rowSpan={1}>
      <Card>
        <Table
          aria-label="Bulk Select Table Demo"
          cells={[{ title: 'Rank' }, { title: 'Points' }, { title: 'First Name' }, { title: 'Second Name' }]}
          rows={[
            { cells: ['#1', '25', 'Malcom', 'X'] },
            { cells: ['#2', '23', 'Martha', 'Kent'] },
            { cells: ['#3', '21', 'Ligia', 'Maria'] },
            { cells: ['#4', '18', 'Marisa', 'Thomey'] },
            { cells: ['#5', '7', 'Cintia', 'Thomas'] },
          ]}
          onSelect={(OnSelect) => console.log(OnSelect)}
        >
          <TableHeader />
          <TableBody />
        </Table>
      </Card>
    </GridItem>
  );
};
