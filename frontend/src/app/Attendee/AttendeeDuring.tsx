import React from 'react';
import { Page, PageSection, 
         Progress, ProgressSize, ProgressVariant, ProgressMeasureLocation
} from '@patternfly/react-core';

export const AttendeeDuring: React.FunctionComponent = () => {
  return (
      <PageSection>
        <Progress
          key="progress-timer"
          size={ProgressSize.lg}
          variant={ProgressVariant.success}
          max={100}
          value={50}
          measureLocation={ProgressMeasureLocation.none}
        />
      </PageSection>
  );
};
