/**
 * Recommendation.tsx
 * Component for recommendation selection.
 */

// Modules.
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

// Enumerators.
import { Recommended } from './Recommendation.enum';

// Interfaces.
import { RecommendationProps } from './Recommendation.interface';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: 'transparent'
    },
    recommended: {
      backgroundColor: 'green',
      color: '#FFFFFF',
      '&:focus': {
        backgroundColor: 'green',
      }
    },
    notRecommended: {
      backgroundColor: 'red',
      color: '#FFFFFF',
      '&:focus': {
        backgroundColor: 'red',
      }
    }
  }),
);

/**
 * Allows users to provide a recommendation for a product.
 */
const Recommendation: React.FC<RecommendationProps> = (props: RecommendationProps) => {
  const classes = useStyles();

  return (
    <Grid container direction='column'>
      <Grid item xs={12}>
        <Typography variant='body1' gutterBottom>
          Do you recommend this product?
        </Typography>
        <Grid container direction='row'>
          <IconButton
            className={props.recommended === Recommended.RECOMMENDED ? classes.recommended : classes.root}
            onClick={(e: React.SyntheticEvent) => props.update(Recommended.RECOMMENDED)}
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            className={props.recommended === Recommended.NOT_RECOMMENDED ? classes.notRecommended : classes.root}
            onClick={(e: React.SyntheticEvent) => props.update(Recommended.NOT_RECOMMENDED)}
          >
            <ClearIcon />
          </IconButton>
        </Grid>
      </Grid> 
    </Grid>
  )
}

export default Recommendation;
