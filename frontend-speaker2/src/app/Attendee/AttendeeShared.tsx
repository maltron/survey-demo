import React from "react";
import { PageSection, PageSectionVariants,
        Title, TitleSizes, 
        Button, ButtonVariant,
        Divider, 
        Progress, ProgressSize, ProgressMeasureLocation, ProgressVariant
} from "@patternfly/react-core";
import { Question } from '@app/Shared/Model';
import { Status } from "@app/Shared/Components";

interface AttendeeQuestionProps {
    question: Question; 
    handleQuestion: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    status?: string; 
}

export const AttendeeQuestion: React.FunctionComponent<AttendeeQuestionProps> = ({ question, handleQuestion, status }) => {
    return (
        <React.Fragment>
            <Status message={status}/>
            <PageSection>
                { question.timer > 0 && (
                    <Progress key="progress-countdown" size={ProgressSize.lg}
                        max={question.timer} variant={undefined}
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