/**
 * Verify.tsx
 * Verification route component.
 */

// Dependent modules.
import * as React from 'react';
import API from '../../../utils/api/Api.model';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { frontloadConnect } from 'react-frontload';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';

// Actions.
import { verify } from '../../../store/user/Actions';

// Enumerators.
import { VerificationStatus } from './Verify.enum';
import { RequestType } from '../../../utils/api/Api.enum';

// Interfaces.
import {
  VerifyProps,
  VerifyResponse
} from './Verify.interface';

/**
 * Loads the email verification from the api before rendering the component the first time.
 * 
 * @param { ReviewDetailsProps } props - the review details properties.
 */
const frontloadVerify = async (props: VerifyProps) => {
  // Format the api request path.
  const { token } = {...props.match.params};

  // Verify the email address.
  await API.requestAPI<VerifyResponse>(`user/verify/${token}`, {
    method: RequestType.GET
  })
  .then((response: VerifyResponse) => {
    if (props.verify) {
      if (response.verified) {
        props.verify(VerificationStatus.VERIFIED);
      } else {
        props.verify(VerificationStatus.UNVERIFIED);
      }
    }
  })
  .catch((error: Error) => {
    console.log(error);
  });
};

/**
 * Verification component.
 */
const Verify: React.FC<VerifyProps> = (props: VerifyProps) => {

  return (
    <Box style={{flexGrow: 1, marginTop: '3rem' }}>
      {props.verified &&
        <Grid
          container
          direction='column'
          justify='flex-start'
          spacing={2}
        >
          {props.verified === VerificationStatus.VERIFIED &&
            <Grid item xs={12} md={6} style={{marginBottom: '1rem'}}>
              <Typography variant='h2' color='secondary'>
                Your email address was verified  
              </Typography>
              <Typography variant='body1' color='textPrimary'>
                Thanks for verifying your email address. You will now be able to enjoy all of the great features ravebox has to offer.  
              </Typography>
            </Grid>
          }
          {props.verified === VerificationStatus.UNVERIFIED &&
            <Grid item xs={12} md={6} style={{marginBottom: '1rem'}}>
              <Typography variant='h2' color='error'>
                We couldn't verify the email address  
              </Typography>
              <Typography variant='body1' color='textPrimary'>
                It's possible this link has expired. Please request another email verification link and try again. 
              </Typography>
            </Grid>
          }
        </Grid>
      }
    </Box>
  );
}

/**
 * Map dispatch actions to properties on the verification.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      verify: verify
    },
    dispatch
  );

/**
 * Map the api image configuration state to the properties.
 *
 */
function mapStateToProps(state: any, ownProps: VerifyProps) {
  const verified: VerificationStatus | undefined = (state.user) ? state.user.verified : undefined;
  return {
    ...ownProps,
    verified
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(frontloadConnect(
  frontloadVerify,
  {
    noServerRender: false,     
    onMount: true,
    onUpdate: false
  })(Verify)
));
