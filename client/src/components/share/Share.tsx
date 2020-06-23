/**
 * Share.tsx
 * Renders the share component based on compatibility.
 */

// Modules.
import * as React from 'react';
import { withRouter } from 'react-router';

// Components.
import ShareButton from './ShareButton';

// Interfaces.
import { ShareProps } from './Share.interface';

/**
 * Component to manage the side navigation of the application.
 */
const Share: React.FC<ShareProps> = (props: ShareProps) => {
  const path: string = `${process.env.RAZZLE_ASSETS_MANIFEST}/${props.location.pathname}`;

  return (
    <ShareButton
      config={{
        params: {
          title: props.title,
          url: path
        }
      }}
      title={props.title}
      url={path}
      image={props.image}
    />
  );
}

export default withRouter(Share);
