/**
 * UpdateProfileLinks.tsx
 * Component for updating profile links.
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
import FormControl from '@material-ui/core/FormControl'; 
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Enumerators.
import { UserLinkType } from '../User.enum';

// Components.
import Input from '../../forms/input/Input';
import StyledButton from '../../elements/buttons/StyledButton';
import UpdateProfileLink from '../updateProfileLink/UpdateProfileLink';

// Interfaces.
import { InputData } from '../../forms/input/Input.interface';
import {
  PrivateProfile,
  UserLink
} from '../User.interface';
import { UpdateProfileLinksProps } from './UpdateProfileLinks.interface';

/**
 * Custom styles for the component.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectField: {
    },
    formContainer: {
      //width: '100%'
    },
    titleContainer: {
      margin: theme.spacing(0, 0, 3)
    }
  })
);

const defaultLinkTypes: Array<UserLinkType> = [
    UserLinkType.BLOG,
    UserLinkType.FACEBOOK,
    UserLinkType.INSTAGRAM,
    UserLinkType.LINKEDIN,
    UserLinkType.PINTEREST,
    UserLinkType.TIKTOK,
    UserLinkType.TWITCH,
    UserLinkType.TWITTER,
    UserLinkType.YOUTUBE
  ];

/**
 * Returns a list of available link options.
 *
 * @param { Array<UserLink> } existingLinks - the existing links.
 *
 * @return Array<UserLinkType>
 */
const restrictOptions: (
  existing: Array<UserLink>
) => Array<UserLinkType> = (
  existing: Array<UserLink>
): Array<UserLinkType> => {

  let userLinkTypes: Array<UserLinkType> = defaultLinkTypes;

  // Loop through the existing links and remove the options if a user already
  // has one in their links.
  if (!existing || existing.length <= 0) {
    return userLinkTypes;
  }

  let i: number = 0;

  do {
    const current: UserLink = existing[i];

    userLinkTypes = userLinkTypes.filter((userLinkType: UserLinkType) => {
      return userLinkType !== current.linkType;
    });

    i++;
  } while (i < existing.length);

  return userLinkTypes
}

/**
 * Renders the form for updating profile links.
 */
const UpdateProfileLinks: React.FC<UpdateProfileLinksProps> = (props: UpdateProfileLinksProps) => {
  // Styles for the zone.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const [links, setLinks] = React.useState<Array<UserLink>>(props.links);

  const [options, setOptions] = React.useState<Array<UserLinkType>>([]);

  const [selectedOption, setSelectedOption] = React.useState<UserLinkType>(options[0]);

  /**
   * Handles updates to the profile form.
   *
   * @param { InputData } data - the field data.
   */
  const updateForm: (
    data: InputData
  ) => (
    index: number
  ) => void = (
    data: InputData
  ) => (
    index: number
  ): void => {
    const updatedLinks: Array<UserLink> = [...links || []];

    if (updatedLinks[index]) {
      updatedLinks[index] = {
        path: data.value,
        linkType: data.key as UserLinkType
      };
    }

    setLinks([...updatedLinks]);

    props.update([...updatedLinks]);
  }

  /**
   * Adds a link to the array of links.
   *
   * @param { UserLinkType } selected - the type of link to be added.
   */
  const addLink: (
    selected: UserLinkType
  ) => void = (
    selected: UserLinkType
  ): void => {
    const updatedLinks: Array<UserLink> = [...links || []];

    updatedLinks.push({
      path: '',
      linkType: selected
    });

    setLinks([...updatedLinks]);

    const updatedOptions: Array<UserLinkType> = restrictOptions(updatedLinks);
    setOptions(updatedOptions);

    if (updatedOptions.length > 0) {
      setSelectedOption(updatedOptions[0]);
    }
  }

  /**
   * Handles changes to the select form.
   *
   * @param { React.ChangeEvent } e - the select field change event.
   */
  const handleChange: (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => void = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ): void => {
    addLink(e.currentTarget.value as UserLinkType);
  };

  /**
   * Submits the updated links.
   *
   * @param { React.SyntheticEvent } e - the button event.
   */
  const submit: (
    e: React.SyntheticEvent
  ) => void = (
    e: React.SyntheticEvent
  ): void => {
    setTimeout(() => {
      props.submit();
    }, 0)
  }

  /**
   * Update the options based on the provided links.
   */
  React.useEffect(() => {

    if (options.length <= 0 && links.length !== defaultLinkTypes.length) {
      setOptions(restrictOptions(links));
    }

  }, [links, props.links]);

  return (
    <Grid container>
      <Grid item xs={12} className={clsx(classes.titleContainer)}>
        <Typography color='textPrimary' variant='h3'>
          Add links to your social platforms
        </Typography>
      </Grid>
      {options.length > 0 &&
        <React.Fragment>
          <Grid item>
            <FormControl
              className={clsx(classes.formContainer)}
              variant='outlined'
            >
              <InputLabel htmlFor="link-platform">
                Social platform
              </InputLabel>
              <Select
                className={clsx(classes.selectField)}
                value={selectedOption}
                onChange={handleChange}
                inputProps={{
                  name: 'platform',
                  id: 'link-platform'
                }}
                label='Social platform'
                native
                variant='outlined'
              >
                {options.map((option: UserLinkType) => (
                  <option value={option} key={option}>{option}</option>
                ))}
              </Select>
              <FormHelperText>Select a social platform to add your link or handle</FormHelperText>
            </FormControl>
          </Grid>
        </React.Fragment>
      }
      {links && links.length > 0 &&
        <React.Fragment>
          {links.map((userLink: UserLink, index: number) => (
            <UpdateProfileLink
              index={index} 
              key={index}
              link={userLink}
              update={updateForm}
            />
          ))}
        </React.Fragment>
      }
      <Grid item xs={12}>
        <StyledButton
          title='Save links'
          clickAction={submit}
        />
      </Grid>
    </Grid>
  );
};

export default UpdateProfileLinks;
