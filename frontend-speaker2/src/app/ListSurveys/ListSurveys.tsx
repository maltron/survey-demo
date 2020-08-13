import React from 'react';
import { Gallery, Card, CardHeader, CardTitle, CardBody } from '@patternfly/react-core';
import { MainPage } from '../Shared/MainPage';

interface Survey {
  ID: number;
  name: string;
}

interface ListSurveysProps {
  surveys: Survey[];
}

export const ListSurveys: React.FunctionComponent<ListSurveysProps> = ({ surveys }) => {
  return (
    <MainPage>
      <Gallery hasGutter>
        {surveys.map((survey, index) => (
          <Card key={index} isHoverable>
            <CardTitle>{survey.name}</CardTitle>
          </Card>
        ))}
      </Gallery>
    </MainPage>
  );
};
