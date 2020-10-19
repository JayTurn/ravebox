/**
 * Logo.tsx
 * The ravebox logo component.
 */

// Modules.
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import SvgIcon from '@material-ui/core/SvgIcon';

// Interfaces.
import { LogoProps } from './Logo.interface';

// Logo icon.
import { LogoSVG, LogoSVGIcon } from './LogoSVG';

/**
 * Renders the ravebox logo.
 */
const Logo: React.FC<LogoProps> = (props: LogoProps) => {
  return (
    <React.Fragment>
      {props.iconOnly ? (
        <Grid
          container
          direction='row'
          style={{width: props.fullWidth ? props.fullWidth : '40px'}}
          alignItems='center'
        >
          <Grid item xs={12}>
            <SvgIcon htmlColor='#FFF' component={() => LogoSVGIcon(props.color)} />
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          direction='row'
          style={{width: props.fullWidth ? props.fullWidth : '150px'}}
          alignItems='center'
        >
          <Grid item xs={12}>
            <SvgIcon component={LogoSVG} />
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
}

export default Logo;
