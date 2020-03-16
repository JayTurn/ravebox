/**
 * TVShowList.tsx
 * Lists of television shows.
 */

// Dependent modules.
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import { connect } from 'react-redux';
import { styled } from '@material-ui/core/styles';

// Dependent components.
import TVShowItem from '../television/TVShowItem';

// Dependent interfaces.
import {
  TVItem,
  TVShowListState,
  TVShowListProps
} from './Television.interface';

// Create styled card.
const StyledShowGrid = styled(Grid)({
  marginBottom: '3rem'
});

// Dependent styles.
//import './mainMenu.css';

/**
 * Displays a list of television shows.
 * @class TVShowList
 */
class TVShowList extends React.Component<
  TVShowListProps,
  TVShowListState
> {
  /**
   * Renders the navigation menu.
   * @method render
   *
   * @return React.ReactNode
   */
  public render(): React.ReactNode {
    return (
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="center"
        >
        {this.props.list && this.props.list.length > 0 &&
          this.props.list.map((item: TVItem, index: number) => {
            return (
              <Grow in={this.props.list.length > 0} key={index}>
                <StyledShowGrid item xs={12} sm={6} md={4} lg={3}>
                  <TVShowItem {...item} baseImageUrl={this.props.baseImageUrl} display={this.props.display} />
                </StyledShowGrid>
              </Grow>
            );
          })
        }
      </Grid>
    );
  }
}

/**
 * Maps the image configuration to the properties.
 */
const mapStatetoProps = (state: any, ownProps: TVShowListProps): TVShowListProps => {
  const baseUrl: string = state.configuration.images.images.base_url,
        imageSize: string = state.configuration.images.images.backdrop_sizes[1];
  return {
    ...ownProps,
    baseImageUrl: `${baseUrl}${imageSize}`
  };
};

export default connect(mapStatetoProps)(TVShowList);
