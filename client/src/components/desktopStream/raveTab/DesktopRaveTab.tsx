/**
 * DesktopRaveTab.tsx
 * Rave information component.
 */

// Modules.
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

// Components.
import ProductDescription from '../../raveStream/productDescription/ProductDescription';
import DesktopCardHolder from '../cardHolder/DesktopCardHolder';
import StreamUserProfile from '../../raveStream/userProfile/StreamUserProfile';

// Enumerators.
import { RaveStreamType } from '../../raveStream/RaveStream.enum';
import { Role } from '../../user/User.enum';

// Interfaces.
import { DesktopRaveTabProps } from './DesktopRaveTab.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';
import {
  Review,
  ReviewLink
} from '../../review/Review.interface';

// Utilities.
import { filterReviews } from '../../review/Review.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: `rgba(100, 106, 240, .1)`
    },
    cardContainer: {
      backgroundColor: theme.palette.background.default,
      borderRadius: 20,
      padding: theme.spacing(2),
      margin: theme.spacing(2)
    },
    descriptionCard: {
    },
    handleText: {
      fontSize: '1rem',
      fontWeight: 500
    },
    raves: {
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(2, 0)
    },
    userCard: {
      padding: theme.spacing(2, 1)
    },
  })
);

/**
 * Renders the rave information.
 */
const DesktopRaveTab: React.FC<DesktopRaveTabProps> = (props: DesktopRaveTabProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  const ref: React.RefObject<HTMLDivElement> = React.useRef(null);

  const [reviewId, setReviewId] = React.useState<string>('');

  const [height, setHeight] = React.useState<number>(0);

  const [reviews, setReviews] = React.useState<Array<Review> | null>();

  /**
   * Handles the updating of the height.
   */
  const handleHeightUpdate: (
  ) => void = (
  ): void => {
    if (ref && ref.current) {
      if (ref.current.clientHeight < 600) {
        setHeight(600);
        props.updateHeight(600);
      } else {
        setHeight(ref.current.clientHeight);
        props.updateHeight(ref.current.clientHeight + 30);
      }
    }
  }

  /**
   * Returns the height of the element when it is loaded.
   */
  React.useEffect(() => {
    if (ref && ref.current) {
      if (height !== ref.current.clientHeight) {
        handleHeightUpdate();
      }
      if (props.review && props.review._id !== reviewId) {
        setReviewId(props.review._id);
        handleHeightUpdate();
        
        if (props.raveStream) {
          setReviews(filterReviews(props.raveStream.reviews)(props.review._id));
        }
      }
    }

  }, [height, ref, props.review, reviewId]);

  return (
    <Grid className={clsx(classes.container)} container ref={ref}>
      {props.review && props.review.user &&
        <React.Fragment>
          <Grid item xs={12} className={clsx(
            classes.cardContainer,
            classes.userCard
          )}>
            <Grid container>
              <Grid item xs={12} className={clsx(classes.userCard)}>
                <StreamUserProfile
                  showFollow={true}
                  user={props.review.user}
                  variant='large'
                />
              </Grid>
            </Grid>
          </Grid>
          {props.review.description &&
            <Grid item xs={12} className={clsx(
              classes.cardContainer
            )}>
                <ProductDescription
                  description={props.review.description} 
                  reviewLinks={props.review.links}
                  updateHeight={handleHeightUpdate}
                  user={props.review.user}
                />  
            </Grid>
          }
          {/*
          {props.raveStream &&
            <Grid item xs={12}
              className={clsx(classes.raves)}
            >
              <DesktopCardHolder
                lg={4}
                md={6}
                sm={12}
                hideProductTitles={false}
                hideStreamTag={true}
                overrideTitle={true}
                reviews={reviews ? [...reviews] : []}
                streamType={props.raveStream.streamType} 
                title={`More raves`}
              />
            </Grid>
          }
          */}
        </React.Fragment>
      }
    </Grid>
  );
};

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: DesktopRaveTabProps) => {
  // Retrieve the current stream from the active properties.
  const raveStream: RaveStream = state.raveStream ? state.raveStream.raveStream : undefined,
        activeIndex: number = state.raveStream ? state.raveStream.active : 0;

  let review: Review | undefined; 

  if (raveStream && raveStream.reviews.length > 0) {
    review = {...raveStream.reviews[activeIndex]};
  }

  return {
    ...ownProps,
    raveStream,
    review
  };
};

export default connect(
  mapStateToProps
)(DesktopRaveTab);
