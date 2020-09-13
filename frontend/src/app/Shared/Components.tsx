import React from 'react';
import { PageSection, PageSectionVariants, 
  Title, TitleSizes, 
  EmptyState, EmptyStateIcon 
} from '@patternfly/react-core';

export const BigTitle: React.FunctionComponent<{ message: string }> = ({ message }) => {
  return (
    <Title key="title-question" headingLevel="h1" 
        size={TitleSizes['4xl']}>{message}</Title>
  );
};

export const Wait: React.FunctionComponent = () => {
  const Spinner = () => (
    <span className="pf-c-spinner" role="progressbar" aria-valuetext="Loading...">
      <span className="pf-c-spinner__clipper" />
      <span className="pf-c-spinner__lead-ball" />
      <span className="pf-c-spinner__tail-ball" />
    </span>
  );

  return (
    <EmptyState>
      <EmptyStateIcon variant="container" component={Spinner} />
      <Title size="lg" headingLevel="h4"></Title>
    </EmptyState>
  );
};

interface StatusProps {
  message: string | undefined;
}

export const Status: React.FunctionComponent<StatusProps> = ({ message }) => {
  return <PageSection variant={PageSectionVariants.darker}>{message ? message : ' '}</PageSection>;
};
