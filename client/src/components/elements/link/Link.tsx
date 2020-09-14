/**
 * Link.tsx
 * Link combining material ui with react router handling.
 */

// Modules.
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  withStyles,
  Theme
} from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import * as React from 'react';
import { Link as ReactLink } from 'react-router-dom';

// Enumerators.
import { StyleType } from './Link.enum';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../analytics/Analytics.interface';
import { LinkProps } from './Link.interface';

// Utilities.
import { formatLinkForTracking } from './Link.common';

/**
 * Styles for the link element.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    '&:hover': {
      textDecoration: 'none'
    }
  },
  buttonPrimary: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.common.white,
    display: 'block',
    fontSize: '.875rem',
    fontWeight: 700,
    lineHeight: 1.75,
    minWidth: 64,
    padding: theme.spacing(1.25, 2),
    textTransform: 'uppercase',
    transition: theme.transitions.create('background-color', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.short
    }),
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  buttonPrimaryInverse: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.primary.dark,
    display: 'block',
    fontSize: '.875rem',
    fontWeight: 700,
    lineHeight: 1.75,
    minWidth: 64,
    padding: theme.spacing(1.5, 2),
    textTransform: 'uppercase',
    transition: theme.transitions.create('background-color', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.short
    }),
    '&:hover': {
      backgroundColor: `rgba(221,222,255,1)`
    }
  },
  buttonSecondary: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.common.white,
    display: 'block',
    fontSize: '.875rem',
    fontWeight: 700,
    lineHeight: 1.75,
    minWidth: 64,
    padding: theme.spacing(1.5, 2),
    textTransform: 'uppercase',
    transition: theme.transitions.create('background-color', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.short
    }),
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark
    }
  },
  buttonSecondaryInverse: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.secondary.dark,
    display: 'block',
    fontSize: '.875rem',
    fontWeight: 700,
    lineHeight: 1.75,
    minWidth: 64,
    padding: theme.spacing(1.5, 2),
    textTransform: 'uppercase',
    transition: theme.transitions.create('background-color', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.short
    }),
    '&:hover': {
      backgroundColor: `rgba(224,255,251,1)`
    }
  },
  searchResultItem: {
    color: `rgba(33,36,104, 0.8)`,
    display: 'block',
    fontWeight: 600,
    padding: theme.spacing(1),
    width: '100%',
    '&:hover': {
      backgroundColor: `rgba(67,74,217, 0.05)`
    }
  },
  standardPrimary: {
  }
}));

/**
 * Link form component.
 */
const LinkElement: React.FC<LinkProps> = (props: LinkProps) => {

  // Use the custom styles.
  const classes = useStyles(),
        analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the link style type.
  const styleType: StyleType = props.styleType ? props.styleType : StyleType.STANDARD_PRIMARY;

  /**
   * Handles analytics tracking for events that have a context.
   */
  const handleClick: (
    e: React.SyntheticEvent
  ) => void = (
    e: React.SyntheticEvent
  ): void => {

    if (props.track) {
      const data: EventObject = formatLinkForTracking(props.track)

      // Add the link title.
      data['link title'] = props.title;

      analytics.trackEvent('select link')(data);
    }

  }

  return (
    <Link
      variant={props.variant}
      className={clsx(
        classes.root, {
        [classes.buttonPrimary]: styleType === StyleType.BUTTON_PRIMARY,
        [classes.buttonPrimaryInverse]: styleType === StyleType.BUTTON_PRIMARY_INVERSE,
        [classes.buttonSecondary]: styleType === StyleType.BUTTON_SECONDARY,
        [classes.buttonSecondaryInverse]: styleType === StyleType.BUTTON_SECONDARY_INVERSE,
        [classes.searchResultItem]: styleType === StyleType.SEARCH_RESULT_ITEM
      })}
      color={props.color}
      component={({className, children}) => {
        return (
          <ReactLink
            className={className}
            onClick={handleClick}
            to={props.path}
            title={props.title}
          >
            {children}
          </ReactLink>
        )
      }}
    >
    { props.title }
    </Link>
  );
}

export default LinkElement;
