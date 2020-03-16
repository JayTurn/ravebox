/**
 * TVShowItem.tsx
 * Individual component for a tv show item.
 */

// Dependent modules.
import * as React from 'react';
import Truncate from 'react-truncate';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { styled } from '@material-ui/core/styles';

// Dependent components.
import WatchlistButton from '../watchlist/WatchlistButton';

// Dependent enumerators.
import { TVItemType } from './TVItemType.enum';

// Dependent interfaces.
import {
  TVShowItemState,
  TVShowItemProps
} from './Television.interface';

// Create styled card.
const StyledCard = styled(Card)({
  maxWidth: '185px'
});

// Create styled card media.
const StyledCardMedia = styled(CardMedia)({
  height: 0,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  paddingTop: '278px'
});

// Create styled card media.
const StyledHeading = styled(Typography)({
  margin: '0.5rem 0',
});

const StyledBody = styled(Typography)({
  margin: '0.3rem 0',
  '& span.heavy': {
    fontWeight: 700
  }
});

/**
 * Displays television show.
 * @class TVItem
 */
class TVShowItem extends React.Component<
  TVShowItemProps,
  TVShowItemState
> {

  /**
   * Restricts the content to a set number of characters.
   * @method textLimit
   */
  /**
   * Renders the navigation menu.
   * @method render
   *
   * @return React.ReactNode
   */
  public render(): React.ReactNode {
    const imagePath: string = `${this.props.baseImageUrl}${this.props.poster_path}`,
          rating: number = Math.round(Number(this.props.vote_average) * 10),
          year: string = this.props.first_air_date.split('-', 1)[0];
    return (
      <React.Fragment>
        <StyledCard>
          <StyledCardMedia
            title={this.props.name}
            image={imagePath}
          />
        </StyledCard>
        <StyledHeading variant="h6">
          {this.props.name}
        </StyledHeading>
        {this.props.display === TVItemType.FULL &&
          <StyledBody variant="body1">
            <span className="heavy">Rated:</span> {rating}%
          </StyledBody>
        }
        <StyledBody variant="body1">
          <span className="heavy">Year:</span> {year}
        </StyledBody>
        {this.props.display === TVItemType.FULL &&
          <StyledBody variant="body1">
            <span className="heavy">Language:</span> {this.props.original_language}
          </StyledBody>
        }
        {this.props.display === TVItemType.PARTIAL &&
          <StyledBody variant="body1">
            <span className="heavy">Overview: </span>
            <Truncate lines={3}>
              {this.props.overview}
            </Truncate>
          </StyledBody>
        }
        <WatchlistButton
          item={this.props}
          watching={false}
        />
      </React.Fragment>
    );
  }
}

export default TVShowItem;
