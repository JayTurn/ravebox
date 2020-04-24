/**
 * Recommendation.tsx
 * Component for recommendation selection.
 */

// Modules.
import Box from '@material-ui/core/Box';
import CheckIcon from '@material-ui/icons/Check';
import Chip from '@material-ui/core/Chip';
import ClearIcon from '@material-ui/icons/Clear';
import clsx from 'clsx';
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
    chip: {
      marginRight: theme.spacing(2),
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: theme.shape.borderRadius,
      boxShadow: `0 0 0 1px ${theme.palette.grey.A200}`,
      textTransform: 'uppercase',
      fontSize: '.9rem',
      '&:focus, &:hover': {
        color: theme.palette.primary.dark,
        boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
        backgroundColor: 'transparent'
      }
    },
    selectedChip: {
      backgroundColor: theme.palette.primary.main,
      borderRadius: theme.shape.borderRadius,
      boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
      color: '#FFFFFF',
      '&:focus, &:hover': {
        color: '#FFFFFF',
        backgroundColor: theme.palette.primary.main,
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
    <Grid
      container
      direction='column'
    >
      <Grid item xs={12} lg={6} style={{marginBottom: '1rem'}}>
        <Typography variant='subtitle1' style={{}}>
          Do you recommend this product?
        </Typography>
      </Grid>
      <Grid item xs={12} lg={6} style={{marginBottom: '2rem'}}>
        <Chip
          className={clsx(classes.chip,{
            [classes.selectedChip]: props.recommended === Recommended.RECOMMENDED
          })}
          clickable={true}
          label={'Yes'}
          onClick={(e: React.SyntheticEvent) => props.update(Recommended.RECOMMENDED)}
        />
        <Chip
          className={clsx(classes.chip,{
            [classes.selectedChip]: props.recommended === Recommended.NOT_RECOMMENDED
          })}
          clickable={true}
          label={'No'}
          onClick={(e: React.SyntheticEvent) => props.update(Recommended.NOT_RECOMMENDED)}
        />
      </Grid> 
    </Grid>
  )
}

export default Recommendation;
