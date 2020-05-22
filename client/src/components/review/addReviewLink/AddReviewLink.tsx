/**
 * AddReviewLink.tsx
 * Component for review link entry.
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

// Components.
import Input from '../../forms/input/Input';

// Interfaces.
import { InputData } from '../../forms/input/Input.interface';
import { AddReviewLinkProps } from './AddReviewLink.interface';

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
 * Allows users to provide a list of review links for a review.
 */
const AddReviewLink: React.FC<AddReviewLinkProps> = (props: AddReviewLinkProps) => {
  const classes = useStyles();

  /**
   * Handles the updating of the field.
   */
  const updateInputs: (
    data: InputData
  ) => void = (
    data: InputData
  ): void => {
    props.update({
      ...props.link,
      [data.key]: data.value
    })(props.index);
  }

  return (
    <Grid
      container
      direction='column'
    >
      <Grid item xs={12} lg={6} style={{marginBottom: '2rem'}}>
        <Grid container direction='row' spacing={2}>
          <Grid item xs={12} lg={6}>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Input
              defaultValue={props.link.path}
              handleBlur={updateInputs}
              name='path'
              prefix='https://'
              required={false}
              type='text'
              title="URL"
            />
            <Input
              defaultValue={props.link.code}
              handleBlur={updateInputs}
              name='code'
              required={false}
              type='text'
              title="Promo/Coupon code"
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              defaultValue={props.link.info}
              id='link-info'
              handleBlur={updateInputs}
              helperText={`Describe any offers related to the link you've shared or the promo code you've provided. Example: Use the promo code to get 10%`}
              name='info'
              rows={3}
              rowsMax={3}
              required={false}
              type='text'
              title="Additional information"
            />
          </Grid>
        </Grid>
      </Grid> 
    </Grid>
  )
}

export default AddReviewLink;
