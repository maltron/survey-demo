import { ProgressVariant } from "@patternfly/react-core";
import { IRow } from '@patternfly/react-table';

// Description of a Survey
export interface Survey {
    ID: number; 
    name: string;
}

// Description of a Attendee
export interface Attendee {
    ID: number;
    firstName: string;
    lastName: string; 
    email: string; 
    points: number;
    survey: number; 
}

// Description of a Speaker
export interface Speaker {
    ID: number; 
    username: string; 
    password: string; 
    email: string; 
}

// Description of an Answer
export interface Answer {
    ID: number; 
    answer: string; 
    isCorrect: boolean; 
}

// Description of a Question 
export interface Question {
    ID: number;
    question: string; 
    timer: number; 
    points: number; 
    answers: Array<Answer>; 
    kind: number; // -1 Before, 0 During, 1 After
}

// Information on what Question the Speaker is on
export interface SpeakerForSurvey {
    speakerID: number; 
    surveyID: number; 
    questionID: number; 
}

export const questionJSON = (question: Question): string => {
    return JSON.stringify({ ID: question.ID, 
            question: question.question, timer: question.timer, 
            points: question.points, answer: question.answers, 
            kind: question.kind })
}

// Description of an Answer Given
export interface Answered {
    ID: number;
    survey: number; 
    attendee: number; 
    question: number; 
    answer: number; 
}

// Create a Answered Object
// ID is not really being used
export const answeredJSON = (surveyID: number, attendeeID: number, 
                    question: Question, answeredID: number): string => {
    return JSON.stringify({ ID: 0, survey: surveyID,
    attendee: attendeeID, question: question.ID, 
        answer: answeredID })
}

export enum AttendeeStep {
    started, // Attendee started to a particular Survey
    before, // Attendee will answer initial questions
    getready, // Wait for Speaker to Begin on the first question
    ready, // Attendee will engage of presentation
    finish,  // Attendee will answer final questions
    end  // Attendee The End
}

export enum AnswerType { 
    answering, not_answered, correct, incorrect 
}

export interface AnswerState {
    answerID: number; 
    type: AnswerType; 
    variant: ProgressVariant | undefined;
}

export const turnAttendeeIntoRows = (attendees: Array<Attendee>): (IRow | string[])[] => {
    return attendees.map(
      (rank: Attendee, index: number) => 
        ({ cells: [ `#${index+1}`, rank.points, 
              rank.firstName, rank.lastName ] }))
  }



