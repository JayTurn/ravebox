/**
 * Link.tsx
 * Link combining material ui with react router handling.
 */

// Modules.
import * as React from 'react';
import Link from '@material-ui/core/Link';
import { Link as ReactLink } from 'react-router-dom';

// Interfaces.
import { LinkProps } from './Link.interface';

/**
 * Link form component.
 */
const LinkElement: React.FC<LinkProps> = (props: LinkProps) => {
  return (
    <Link
      variant={props.variant}
      color={props.color}
      component={({className, children}) => {
        return (
          <ReactLink className={className} to={props.path} title={props.title}>
            {children}
          </ReactLink>
        );
      }}
    >
    { props.title }
    </Link>
  );
}

export default LinkElement;
