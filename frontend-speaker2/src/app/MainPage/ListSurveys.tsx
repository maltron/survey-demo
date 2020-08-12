import React from "react";
import { Gallery, Card, CardHeader, CardTitle, CardBody } from "@patternfly/react-core";

interface Survey {
    ID: number;
    name: string; 
}

interface ListSurveysProps {
    surveys: Survey[]
}

export const ListSurveys: React.FunctionComponent<ListSurveysProps> = ({ surveys }) => {
 
    return (
        <Gallery hasGutter>
            <Card key="10" isHoverable>Hello</Card>
            {surveys.map((survey, index) => {(
                <Card key={index} isHoverable>
                    <CardTitle>{survey.name}</CardTitle>
                </Card>
            )})}
        </Gallery>       
    )
}