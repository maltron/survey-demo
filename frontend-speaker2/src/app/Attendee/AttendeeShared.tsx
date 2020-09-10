import React from "react";
import { PageSection, 
        Title, TitleSizes, 
        Button, ButtonVariant,
        Divider, 
        Progress, ProgressSize, ProgressMeasureLocation, ProgressVariant
} from "@patternfly/react-core";
import { Question } from '@app/Shared/Model';
import { Status } from "@app/Shared/Components";

enum AnswerType { 
    answering, not_answered, correct, incorrect 
}

interface AnswerState {
    answerID: number; 
    type: AnswerType; 
    variant: ProgressVariant | undefined;
}

interface AttendeeQuestionProps {
    question: Question; 
    handleQuestion: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    status?: string; 
}

export const AttendeeQuestion: React.FunctionComponent<AttendeeQuestionProps> = ({ question, handleQuestion, status }) => {
    const [ countDown, setCountDown ] = React.useState<number>(question.timer);
    // Reference of the timer, so one can handle starts and stops
    const tick = React.useRef<NodeJS.Timeout>();
    const [ state, setState ] = React.useState<AnswerState>({
        answerID: 0, type: AnswerType.answering, variant: undefined
    });

    // Used to timer the amount of time avaiable to answer the question 
    React.useEffect(() => {
        if(state.type == AnswerType.answering && question.timer > 0) {
            // Executes each second
            const interval = setInterval(() => {
                // Decrease the amount based on the timer defined in each question
                setCountDown(prevCountDown => prevCountDown -1 );
                if(countDown == 0) {
                    setState({ ...state, type: AnswerType.not_answered });
                    clearInterval(tick.current as NodeJS.Timeout);
                }
            }, 1000); 
            tick.current = interval; 
            return () => clearInterval(tick.current as NodeJS.Timeout);
        }

        return undefined; 
    }, [countDown]);

    // Stop the timer due a selection in the answer
    const stopTimer = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
        clearInterval(tick.current as NodeJS.Timeout);
        
    }

    return (
        <React.Fragment>
            <Status message={status}/>
            <PageSection>
                { question.timer > 0 && (
                    <Progress key="progress-countdown" size={ProgressSize.lg}
                        max={question.timer} 
                        value={countDown} variant={state.variant}
                        measureLocation={ProgressMeasureLocation.none}
                />)}
                <Title key="title-question" 
                    headingLevel="h1" 
                    size={TitleSizes['4xl']}>{question.question}</Title>
                <Divider/>
                { question.answers.map((answer, index) =>
                    <p key={answer.ID}>
                        <Button key={answer.ID} id={answer.ID.toString()}
                            onClick={handleQuestion}
                            variant={ButtonVariant.primary}>{index+1}. {answer.answer}</Button>
                    </p>
                )}
            </PageSection>
        </React.Fragment>
    )    
}