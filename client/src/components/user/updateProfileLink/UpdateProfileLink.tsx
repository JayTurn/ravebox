/**
 * UpdateProfileLink.tsx
 * Component for updating profile link.
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
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Components.
import Input from '../../forms/input/Input';

// Interfaces.
import { InputData } from '../../forms/input/Input.interface';
import {
  PrivateProfile,
  UserLink
} from '../User.interface';
import { UpdateProfileLinkProps } from './UpdateProfileLink.interface';

// Utilities.
import { getExternalLinkPath } from '../User.common';

/**
 * Custom styles for the component.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(2, 0)
    }
  })
);

/**
 * Returns a list of available link options.
 *
 * @param { Array<UserLink> } existingLinks - the existing links.
 *
 * @return Array<UserLinkType>
 */

/**
 * Renders the form for updating profile link.
 */
const UpdateProfileLink: React.FC<UpdateProfileLinkProps> = (props: UpdateProfileLinkProps) => {
  // Styles for the zone.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const [linkDetails, setLinkDetails] = React.useState<UserLink>(props.link);

  const externalPath: string = getExternalLinkPath(linkDetails.linkType); 

  /**
   * Updates the values for the profile link.
   *
   * @param { InputData } data - the data to be updated.
   */
  const updateForm: (
    data: InputData
  ) => void = (
    data: InputData
  ): void => {
    props.update(data)(props.index);
  }

  return (
    <Grid container className={clsx(classes.container)}>
      <Grid item xs={12}>
        <Input
          defaultValue={linkDetails.path}
          handleBlur={updateForm}
          name={linkDetails.linkType}
          type='text'
          title={`${linkDetails.linkType}`}
          helperText={`Only add your ${linkDetails.linkType} username or handle`}
        />
      </Grid>
    </Grid>
  );
};

export default UpdateProfileLink;
