/**
 * Logo.tsx
 * The ravebox logo component.
 */

// Modules.
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import SvgIcon from '@material-ui/core/SvgIcon';

// Enumerators.
import { LogoColor } from './Logo.enum';

// Interfaces.
import { LogoProps } from './Logo.interface';

// Logo icon.
import {
  LogoSVG,
  LogoSVGIcon,
  LogoSVGStacked
} from './LogoSVG';

/**
 * Renders the ravebox logo.
 */
const Logo: React.FC<LogoProps> = (props: LogoProps) => {
  const color: string = props.color === LogoColor.MAIN ? '#646AF0' : '#FFFFFF';
  return (
    <React.Fragment>
      {props.iconOnly ? (
        <Grid
          container
          direction='row'
          style={{
            width: props.fullWidth ? props.fullWidth : '40px',
            margin: props.alignCenter ? '0 auto' : 'inherit'
          }}
          alignItems='center'
        >
          <Grid item xs={12}>
            <SvgIcon htmlColor={color} component={() => LogoSVGIcon(color)} />
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          direction='row'
          style={{
            width: props.fullWidth ? props.fullWidth : '150px',
            margin: props.alignCenter ? '0 auto' : 'inherit'
          }}
          alignItems='center'
        >
          <Grid item xs={12}>
            {props.stacked ? (
              <SvgIcon component={LogoSVGStacked} />
            ) : (
              <SvgIcon component={LogoSVG} />
            )}
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
}

export default Logo;
