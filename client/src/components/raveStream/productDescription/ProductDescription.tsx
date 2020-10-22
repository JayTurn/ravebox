/**
 * ProductDescription.tsx
 * Product images component.
 */

// Modules.
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
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
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

// Interfaces.
import { ProductDescriptionProps } from './ProductDescription.interface';

/**
 * Styled expansion panel.
 */
const ExpansionPanel = withStyles({
  root: {
    backgroundColor: 'transparent',
    borderBottom: `1px solid rgba(0,0,0,0.1)`,
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

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(0, 1)
    },
    expansionIcon: {
      color: theme.palette.text.secondary,
    },
    expansionPanel: {
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
    }
  })
);

/**
 * Renders the product images.
 */
const ProductDescription: React.FC<ProductDescriptionProps> = (props: ProductDescriptionProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Set an expanded state for the description content.
  const [expanded, setExpanded] = React.useState<boolean>(false);

  /**
   * Handles switching between full and short text.
   */
  const handleExpansion: (
  ) => void = (
  ): void => {
    setExpanded(!expanded);
  }

  return (
    <Grid className={clsx(classes.container)} container>
      <Grid item xs={12}>
        <ExpansionPanel
          className={classes.expansionPanel}
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
              Product details
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {props.description.split('\n').map((item: string, index: number) => {
              if (item) {
                return (
                  <Typography
                    className={clsx(classes.paragraph)}
                    component='p'
                    key={index}
                    variant='body1' 
                  >
                    {item}
                  </Typography>
                );
              }
            })}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    </Grid>
  );
};

export default ProductDescription;
