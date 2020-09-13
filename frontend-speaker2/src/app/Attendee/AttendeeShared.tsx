import React from "react";
import { PageSection, 
        Title, TitleSizes, 
        Button, ButtonVariant,
        Divider, Label,
        Progress, ProgressSize, ProgressMeasureLocation
} from "@patternfly/react-core";
import { InfoCircleIcon } from '@patternfly/react-icons';
import { Attendee, Question, Answer, AnswerState, AnswerType, AttendeeStep 
} from '@app/Shared/Model';
import { Status } from "@app/Shared/Components";

export interface AttendeeQuestionState {
    errorMessage: string; 
    step: AttendeeStep; 
    registration: Attendee;
    loadingQuestions: boolean; 
    questionsBefore: Array<Question>;
    questionsFinish: Array<Question>;
    currentQuestion: number; 
    answerState: AnswerState;
    status?: string; 
    countDown: number; 
}

interface AttendeeQuestionProps {
    tick: React.MutableRefObject<NodeJS.Timeout | undefined>;
    question: Question; 
    attendeeQuestionState: [ AttendeeQuestionState, React.Dispatch<React.SetStateAction<AttendeeQuestionState>> ];
    handleQuestion: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    // status?: string; 
    // answerState: [ AnswerState, React.Dispatch<React.SetStateAction<AnswerState>> ];
    // count: [ number, React.Dispatch<React.SetStateAction<number>> ]
}

export const AttendeeQuestion: React.FunctionComponent<AttendeeQuestionProps> 
    = ({ tick, question, attendeeQuestionState, handleQuestion }) => {
    const [ state, setState ] = attendeeQuestionState;
    // const [ countDown, setCountDown ] = count;
    // // Reference of the timer, so one can handle starts and stops
    // const [ state, setState ] = answerState; 

    // Used to timer the amount of time avaiable to answer the question 
    React.useEffect(() => {
        if(state.answerState.type == AnswerType.answering && question.timer > 0) {
            // Executes each second
            const interval = setInterval(() => {
                // Decrease the amount based on the timer defined in each question
                setState(prevState => {
                    return { ...state, countDown: prevState.countDown -1 }
                });
                // setCountDown(prevCountDown => prevCountDown -1 );
                
                if(state.countDown == 0) {
                    // setState({ ...state, type: AnswerType.not_answered });
                    setState({ ...state, 
                        answerState: { ...state.answerState, type: AnswerType.not_answered }});
                    clearInterval(tick.current as NodeJS.Timeout);
                }
            }, 1000); 
            tick.current = interval; 
            return () => clearInterval(tick.current as NodeJS.Timeout);
        }

        return undefined; 
    }, [state.countDown]);

    // // Stop the timer due a selection in the answer
    // const stopTimer = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
    //     clearInterval(tick.current as NodeJS.Timeout);

    // }

    const points = (question: Question): JSX.Element => {
        switch(state.answerState.type) {
            case AnswerType.correct:
                return <Label icon={<InfoCircleIcon/>} 
                color="green">+{question.points} points</Label>
            case AnswerType.incorrect:
                return <Label icon={<InfoCircleIcon/>}
                color="red">ZERO points</Label>
        }

        return <Label>{" "}</Label>
    }

    const paintButton = (answer: Answer, index: number): JSX.Element => {
        if(answer.isCorrect) {
            return <Button key={answer.ID} id={answer.ID.toString()}
                        variant={ButtonVariant.primary}>{index+1}. {answer.answer}</Button>
        } else if(answer.ID == state.answerState.answerID && !answer.isCorrect) {
            return <Button key={answer.ID} id={answer.ID.toString()}
                        variant={ButtonVariant.danger}>{index+1}. {answer.answer}</Button>
        }

        return <Button isDisabled key={answer.ID} id={answer.ID.toString()}
            variant={ButtonVariant.tertiary}>{index+1}. {answer.answer}</Button>
    }

    const buttonLayout = (): Array<JSX.Element> => {
        switch(state.answerState.type) {
            case AnswerType.not_answered: 
                return question.answers.map((answer, index) =>
                <p key={answer.ID}>
                    <Button isDisabled key={answer.ID} id={answer.ID.toString()}
                        onClick={handleQuestion}
                        variant={ButtonVariant.tertiary}>{index+1}. {answer.answer}</Button>
                </p>)
            case AnswerType.correct: 
                return question.answers.map((answer, index) =>
                    <p key={answer.ID}>{paintButton(answer,index)}</p>)
            case AnswerType.incorrect:
                return question.answers.map((answer, index) =>
                    <p key={answer.ID}>{paintButton(answer,index)}</p>)
        }

        return question.answers.map((answer, index) =>
            <p key={answer.ID}>
                <Button key={answer.ID} id={answer.ID.toString()}
                    onClick={handleQuestion}
                    variant={ButtonVariant.tertiary}>{index+1}. {answer.answer}</Button>
            </p>)
    }

    return (
        <React.Fragment>
            <Status message={status}/>
            <PageSection>
                { question.timer > 0 && (
                    <Progress key="progress-countdown" size={ProgressSize.lg}
                        max={question.timer} 
                        value={state.countDown} variant={state.answerState.variant}
                        measureLocation={ProgressMeasureLocation.none}
                />)}
                <Title key="title-question" 
                    headingLevel="h1" 
                    size={TitleSizes['4xl']}>{question.question}</Title>
                {points(question)}
                <Divider/>
                {buttonLayout()}
            </PageSection>
        </React.Fragment>
    )    
}