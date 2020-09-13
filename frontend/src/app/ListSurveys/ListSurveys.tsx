import React from 'react';
import {
  Gallery,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  PageSection,
  TextContent,
  TextVariants,
  EmptyState,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import { MainPage } from '../Shared/MainPage';
import { useAPISurveys } from '../Backend/APIReqquest';

export const ListSurveys: React.FunctionComponent = () => {
  const [loading, surveys] = useAPISurveys();

  const Spinner = () => (
    <span className="pf-c-spinner" role="progressbar" aria-valuetext="Loading...">
      <span className="pf-c-spinner__clipper" />
      <span className="pf-c-spinner__lead-ball" />
      <span className="pf-c-spinner__tail-ball" />
    </span>
  );

  const surveyTitle = surveys.length == 1 ? '1 Survey'
    : surveys.length > 1 ? `${surveys.length} Surveys` : 'No Surveys';

  return (
    <MainPage>
      {loading && (
        <EmptyState>
          <EmptyStateIcon variant="container" component={Spinner} />
          <Title size="lg" headingLevel="h4"></Title>
        </EmptyState>
      )}
      {!loading && (
        <React.Fragment>
          <PageSection variant="light">
            <h1>{surveyTitle}</h1>
          </PageSection>
          <PageSection variant="default">
            <Gallery hasGutter>
              {surveys.map((survey) => (
                <Card key={survey.ID} isHoverable>
                  <CardTitle>{survey.name}</CardTitle>
                </Card>
              ))}
            </Gallery>
          </PageSection>
        </React.Fragment>
      )}
    </MainPage>
  );
};