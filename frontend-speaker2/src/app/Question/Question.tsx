import React from "react";
import { Card, CardTitle, CardBody, CardFooter, Divider } from "@patternfly/react-core";

export interface QuestionProps {
    question?: string;
    timer: number; 
    points: number; 
    answers: Array<{ 
        id: string, 
        answer: string, 
        is_correct: boolean }>
}


export const Question: React.FunctionComponent<QuestionProps> = ({ question, timer, points, answers }) => {

    return (
        <Card>
            <CardTitle>{question}</CardTitle>
            <Divider/>
            <CardBody>{answers.map(answer => (
                    answer.answer
            ))}
            </CardBody>
        </Card>
    )
}