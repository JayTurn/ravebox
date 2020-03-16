/**
 * AccountFormNavigation.tsx
 * Navigation for the account form.
 */

// Modules.
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

// Contexts.
//import {
  //AccountContext,
//} from '../../account/Account.context';

// Enumerators.
import { MultiStepNavigationProgress as Progress} from './MultiStepNavigation.enum';

// Interfaces.
import {
  MultiStepNavigationProps
} from './MultiStepNavigation.interface';

/**
 * Provides the multi-step navigation steps.
 *
 */
const MultiStepNavigation: React.FC<MultiStepNavigationProps> = (props: MultiStepNavigationProps) => {

  return(
    <div>
      <Stepper activeStep={props.activeStep} alternativeLabel>
        {props.steps.map((step: string, index: number) => {
          return (
            <Step key={index}>
              <StepLabel>{step}</StepLabel>
            </Step>
          )
        })}
      </Stepper>
    </div>
  );
}

const mapStatetoProps = (state: {}, ownProps: MultiStepNavigationProps) => {
  return {
    ...ownProps
  };
};

export default withRouter(connect(mapStatetoProps)(MultiStepNavigation));
