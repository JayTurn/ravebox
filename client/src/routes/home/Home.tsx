/**
 * Home.tsx
 * Home screen route component.
 */

// Modules.
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';

// Dependent interfaces.
import { HomeProps, HomeState } from './Home.interface';

// Dependent components.
//import Search from '../../components/search/Search';

/**
 * Home route component.
 */
const Home: React.FC<HomeProps> = (props: HomeProps) => {
  /**
   * Render the home route component.
   */
  return (
    <div style={{'flexGrow': 1}}>
      <Grid
        container
        direction='column'
        justify='flex-start'
        alignItems='center'
      >
        <Typography variant='h1'>
          Welcome to Ravebox
        </Typography>
      </Grid>
    </div>
  );
}

/**
 * Map the api image configuration state to the properties.
 *
 */
function mapStatetoProps(state: HomeState, ownProps: HomeProps) {
  return {
    ...ownProps,
  };
}

/**
 * Map dispatch actions to the home route.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
    },
    dispatch
  );

export default connect(
    mapStatetoProps,
    mapDispatchToProps
  )(Home);
