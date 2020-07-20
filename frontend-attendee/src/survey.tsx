import React from 'react';
import {    Button,
            PageSection, Title, TitleSizes, Checkbox, Divider,
            Progress, ProgressSize, ProgressMeasureLocation, ProgressVariant
 } from '@patternfly/react-core';

enum ProgressStatus {running, correct, wrong}

interface QuestionProps {
    question?: string;
    answers: Array<{ 
        id: string, 
        answer: string, 
        is_correct: boolean }>
}

interface ProgressSituation {
    counter: number;
    min: number;
    max: number; 
    variant: ProgressVariant | undefined;

}

const Question: React.FunctionComponent<QuestionProps> = ({ question, answers }) => {
    const [ answered, setAnswered ] = React.useState<string>("");
    const [ progress, setProgress ] = React.useState<any>();
    const [ situation, setSituation ] = React.useState<ProgressSituation>({
            counter: 10, min: 0, max: 10, variant: undefined
    });

    React.useEffect(() => {
        setProgress(setInterval(() => {
            if(situation.counter > 0) {
                // setCounter(prevCounter => prevCounter - 1);
                setSituation( prevSituation => {
                    return {...prevSituation, counter: prevSituation.counter -1 }
                });
            } else {
                clearInterval(progress);
                wrong();
            }
        }, 1000));
    }, [])

    // React.useEffect(() => {
    //     counter > 0 && setTimeout(() => 
    //                 setCounter(counter - 1), 1000);
    //   }, [counter]);

    const stopTimer = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
        console.log("stopTimer()", progress);
        if(progress) clearInterval(progress);

        const { id } = event.currentTarget;
        setAnswered(id); 
        let correct: boolean = false; 
        answers.map(answer => {
            if(id == answer.id && answer.is_correct) {
                correct = true; 
            }
        })
        if(correct) rightAnswered(); else wrongAnswered();
    }

    const wrongAnswered = (): void => {
        setSituation({ ...situation, min: 0, max: 100, counter: 100,
            variant: ProgressVariant.danger });
    }

    const rightAnswered = (): void => {
        setSituation({ ...situation, min: 0, max: 100, counter: 100,
            variant: ProgressVariant.success });
    }

    return (
        <PageSection>
            <Progress key="progress" size={ProgressSize.lg}
            value={situation.counter} min={situation.min} max={situation.max}
            variant={situation.variant}
            measureLocation={ProgressMeasureLocation.none}/>
            <Title key="question" headingLevel="h1" size={TitleSizes['4xl']}>
                {question ? question : "NO QUESTION"}
            </Title>
            <Divider/>
            {
                answers.map( (answer, index) => 
                    <p key={answer.id}>
                    { ! answered ? 
                        <Button key={answer.id} id={answer.id} variant="tertiary" 
                            onClick={stopTimer}>{index+1}. {answer.answer}</Button>
                    : answered ?
                        answered != answer.id && !answer.is_correct ?
                            <Button isDisabled key={answer.id} id={answer.id} variant="danger" >{index+1}. {answer.answer}</Button>
                        : answered == answer.id ?
                            answer.is_correct ? <Button key={answer.id} id={answer.id} variant="primary">{index+1}. {answer.answer}</Button>
                                              : <Button key={answer.id} id={answer.id} variant="danger">{index+1}. {answer.answer}</Button>
                        : <Button key={answer.id} id={answer.id} variant="primary">{index+1}. {answer.answer}</Button>
                    : null
                    }
                    
                    </p>
                    // <Checkbox key={answer.id} id="{answer.id}" name="{answer.id}"
                    //     label={<Title headingLevel="h2" size="3xl">{answer.answer}</Title>}
                    //     onChange={stopTimer}/>
                    )
            }            
        </PageSection>
    );
};

export { Question };
