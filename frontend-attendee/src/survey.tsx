import React from 'react';
import {    Button,
            PageSection, Title, TitleSizes, Label, Divider,
            Progress, ProgressSize, ProgressMeasureLocation, ProgressVariant
 } from '@patternfly/react-core';
 import { InfoCircleIcon } from '@patternfly/react-icons';

interface QuestionProps {
    question?: string;
    timer: number; 
    points: number; 
    answers: Array<{ 
        id: string, 
        answer: string, 
        is_correct: boolean }>
}

enum AnswerType { answering, not_answered, correct, incorrect }

interface Answer {
    answer: string; 
    type: AnswerType;
    variant: ProgressVariant | undefined;
}

const Question: React.FunctionComponent<QuestionProps> = ({ question, timer, points, answers }) => {
    // const countdown = React.useRef(timer);
    const [ countDown, setCountDown ] = React.useState<number>(timer);
    const tick = React.useRef<any>();
    const [ answered, setAnswered ] = React.useState<Answer>({
        answer: "", type: AnswerType.answering, variant: undefined});

    React.useEffect(() => {
        // console.log("React.useEffect() BEGIN");
        if(answered.type == AnswerType.answering) {
            const interval = setInterval(() => {
                // console.log("React.useEffect() RUNNING ", countDown);
                setCountDown(prevCountDown => prevCountDown - 1);
                if(countDown == 0) {
                    setAnswered(prevAnswered => {
                        return {...prevAnswered, type: AnswerType.not_answered}
                    })
                    clearInterval(tick.current);
                }

            }, 1000);
            tick.current = interval; 
            return () => clearInterval(tick.current);
        }

        return undefined;
    }, [countDown])

    const stopTimer = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
        clearInterval(tick.current);

        const { id } = event.currentTarget;
        let correct: boolean = false; 
        answers.map(answer => {
            if(id == answer.id && answer.is_correct) {
                correct = true; 
            }
        })
        setAnswered({
            answer: id, 
            type: correct ? AnswerType.correct : AnswerType.incorrect,
            variant: correct ? ProgressVariant.success : ProgressVariant.danger
        })
    }

    return (
        <PageSection>
            <Progress key="progress" size={ProgressSize.lg}
            value={!answered.answer ? countDown : timer } max={timer} 
            variant={answered.variant}
            measureLocation={ProgressMeasureLocation.none}/>
            <Title key="question" headingLevel="h1" size={TitleSizes['4xl']}>
                {question ? question : "NO QUESTION"}
            </Title>
            {
                answered.type == AnswerType.answering ? <Label>{" "}</Label> :
                answered.type == AnswerType.correct ? 
                    <Label icon={<InfoCircleIcon/>} 
                        color="green">+{points} points</Label> :
                    <Label icon={<InfoCircleIcon/>} 
                        color="red">ZERO points</Label>
            }            
            <Divider/>
            {
                answers.map( (answer, index) => 
                <p key={answer.id}>
                    { answered.type == AnswerType.answering ?
                        <Button key={answer.id} id={answer.id} variant="tertiary" 
                        onClick={stopTimer}>{index+1}. {answer.answer}</Button>
                    : answered.type == AnswerType.not_answered ?
                        <Button isDisabled key={answer.id} id={answer.id} variant="tertiary" 
                                >{index+1}. {answer.answer}</Button>
                    : answered.type == AnswerType.correct || answered.type == AnswerType.incorrect ?
                        answer.is_correct ? 
                            <Button key={answer.id} id={answer.id} variant="primary" 
                            >{index+1}. {answer.answer}</Button>
                        : answered.answer == answer.id && answered.type == AnswerType.incorrect ?
                            <Button key={answer.id} id={answer.id} variant="danger"
                                >{index+1}. {answer.answer}</Button> 
                        : <Button isDisabled key={answer.id} id={answer.id} variant="tertiary" 
                        >{index+1}. {answer.answer}</Button>
                    : null
                    }
                </p>
                )
            } 
        </PageSection>
    );
};

export { Question };
