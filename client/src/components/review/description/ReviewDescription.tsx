/**
 * ReviewDescription.tsx
 * Renders the review description content.
 */

// Modules.
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import ExpandLessRoundedIcon from '@material-ui/icons/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Interfaces.
import { ReviewDescriptionProps } from './ReviewDescription.interface';

/**
 * Styles for the wrapping button element.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  expansionIcon: {
    color: theme.palette.text.secondary,
  },
  expansionPanelLarge: {
    borderTop: `1px solid rgba(0,0,0,0.1)`,
  },
  expansionTitle: {
    color: theme.palette.text.secondary,
    fontSize: '.9rem',
    fontWeight: 600,
    textTransform: 'uppercase'
  },
  paragraph: {
    fontSize: '.9rem',
    marginBottom: theme.spacing(1)
  },
  showButton: {
    padding: 0
  }
}));

/**
 * Styled expansion panel.
 */
const ExpansionPanel = withStyles({
  root: {
    backgroundColor: 'transparent',
    boxShadow: 'none'
  },
  expanded: {
  }
})(Accordion);

/**
 * Styled expansion panel summary.
 */
const ExpansionPanelSummary = withStyles(theme => ({
  root: {
    margin: 0,
    minHeight: `24px !important`,
    padding: 0
  },
  content: {
    margin: theme.spacing(0)
  },
  expanded: {
    marginBottom: `0px !important`,
    marginTop: `0px !important`
  },
}))(AccordionSummary);

/**
 * Styled expansion panel details.
 */
const ExpansionPanelDetails = withStyles({
  root: {
    flexDirection: 'column',
    padding: `0 0 8px`
  }
})(AccordionDetails);

/*
 * Renders the description component for a review.
 *
 * @param { ReviewDescriptionProps } props - the description properties.
 */
const ReviewDescription: React.FC<ReviewDescriptionProps> = (
  props: ReviewDescriptionProps
) => {
  // Use the custom styles.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  // Set an expanded state for the description content.
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const [loaded, setLoaded] = React.useState<number>(0);

  /**
   * Handles the expansion change event.
   */
  const handleExpansion: (
  ) => void = (
  ): void => {
    setExpanded(!expanded);
  }

  React.useEffect(() => {
    if (loaded <= 1) {
      setLoaded(loaded + 1);
      setExpanded(largeScreen);
    }
  }, [largeScreen, loaded])

  return (
    <Grid container direction='column'>
      <Grid item xs={12}>
        <ExpansionPanel
          className={clsx(
            {
              [classes.expansionPanelLarge]: largeScreen
            }
          )}
          square
          expanded={expanded}
          onChange={handleExpansion}
        >
          <ExpansionPanelSummary
            aria-controls='rave-content'
            expandIcon={<ExpandMoreRoundedIcon className={clsx(classes.expansionIcon)}/>}
            id='rave-content-header'
          >
            <Typography variant='subtitle2' className={clsx(classes.expansionTitle)}>
              More details
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {props.description.split('\n').map((item: string, index: number) => {
              if (item) {
                return (
                  <Typography variant='body1' key={index} className={clsx(
                      classes.paragraph
                    )}
                  >
                    {item}
                  </Typography>
                )
              }
            })}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    </Grid>
  );
}

export default ReviewDescription;
