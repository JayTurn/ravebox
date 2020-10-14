/**
 * AdminManageTag.tsx
 * Renders the component displaying app tag.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  useSnackbar,
  VariantType
} from 'notistack';

// Components.
import AdminAutoCompleteField from '../autocompleteField/AdminAutoCompleteField';

// Enumerators.
import { RequestType } from '../../../utils/api/Api.enum';
import { TagAssociation } from '../../tag/Tag.enum';

// Hooks.
import { useAutocompleteTagSearch } from '../../tag/search/useAutocompleteTagSearch.hook';

// Interfaces.
import { AddTagFormResponse } from '../../tag/Tag.interface';
import { AdminManageTagProps } from './AdminManageTag.interface';
import { Tag } from '../../tag/Tag.interface';

/**
 * Create styles for the tag management screen.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
}));

/**
 * Renders the tag management component on the admin screen.
 */
const AdminManageTag: React.FC<AdminManageTagProps> = (props: AdminManageTagProps) => {
  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const [creating, setCreating] = React.useState<boolean>(false);

  // Register the snackbar.
  const { enqueueSnackbar } = useSnackbar();

  const [editing, setEditing] = React.useState<boolean>(false);

  const [submitting, setSubmitting] = React.useState<boolean>(false);

  // Form error messages to be displayed if fields haven't been validated
  // and prevents submissions to the api.
  const [formErrorMessages, setFormErrorMessages] = React.useState(['']);

  // Use the autocomplete search hook for product type search requests.
  const tagSearch = useAutocompleteTagSearch({
    association: props.association
  });

  /**
   * Sets the editing state.
   */
  const handleCreatingState: (
  ) => void = (
  ): void => {
    setCreating(!creating);
  }

  /**
   * Handles adding a new tag.
   *
   * @param { string } name - the name of the new tag.
   */
  const handleTagCreate: (
    name: string
  ) => void = (
    name: string
  ): void => {

    // Don't do anything if we're already submitting.
    if (submitting) {
      return;
    }

    // Set the submission state.
    setSubmitting(true);

    API.requestAPI<AddTagFormResponse>('tag/create', {
      method: RequestType.POST,
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      body: JSON.stringify({
        name: name,
        association: props.association,
        linkTo: props.linkId
      })
    })
    .then((response: AddTagFormResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setFormErrorMessages([response.title])

        setSubmitting(false);
        return;
      }

      // Display the success message to the user.
      enqueueSnackbar(`${response.tag.name} created successfully`, { variant: 'success' });

      // Update the product with the product type details.
      //setProduct({
        //...product,
        //productType: {...response.tag}
      //});
      setSubmitting(false);
    })
    .catch((error: Error) => {
      enqueueSnackbar(`There was a problem creating ${name}`, { variant: 'error'});
      setSubmitting(false);
    });
  }

  /**
   * Handles selecting an existing tag.
   *
   * @param { number } index - the index of the selected tag.
   */
  const handleTagSelect: (
    index: number
  ) => void = (
    index: number
  ): void => {
  }

  return (
    <Grid container>
      <TableContainer>
        <Table>  
          <TableBody>
            {props.existing && props.existing.length > 0 ? (
              <React.Fragment>
                {props.existing.map((sub: Tag) => (
                  <TableRow>
                    <TableCell>
                      {sub.name}
                    </TableCell>
                    <TableCell>
                      <TableContainer>
                        <Table>
                          <TableBody>
                            {sub.linkFrom && sub.linkFrom.length > 0 ? (
                              <React.Fragment>
                                {sub.linkFrom.map((category: Tag) => (
                                  <TableRow>
                                    <TableCell>
                                      {category.name}      
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </React.Fragment>
                            ) : (
                              <TableRow>
                                <TableCell>
                                  <Grid item>
                                    <IconButton 
                                      onClick={handleCreatingState}
                                      title={`Add ${TagAssociation} tag`}
                                    >
                                      <AddCircleRoundedIcon />
                                    </IconButton>
                                  </Grid>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ): (
              <TableRow>
                <TableCell>
                  <Grid item>
                    <IconButton 
                      onClick={handleCreatingState}
                      title={`Add ${TagAssociation} tag`}
                    >
                      <AddCircleRoundedIcon />
                    </IconButton>
                  </Grid>
                </TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
            )}
            {/*
            {props.existing && props.existing.length > 0 ? (
              <React.Fragment>
                {props.existing.map((subcategory: Tag) => (
                  <TableRow key={subcategory._id}>
                    <TableCell>
                      {subcategory}
                    </TableCell>
                    {subcategory.linkFrom && subcategory.linkFrom.length > 0 ? (
                      <TableCell>
                        <TableContainer>
                          <Table>
                            <TableBody>
                              {subcategory.linkFrom.map((category: Tag) => (
                                <TableRow key={category._id}>
                                  <TableCell>
                                    {category.name}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </TableCell>
                    ) : (
                      <TableCell>
                        <React.Fragment>
                          Add a category
                        </React.Fragment>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </React.Fragment>
            ) : (
              <TableRow>
                <TableCell>
                  Add a subcategory
                </TableCell>
                <TableCell>
                  Add a category
                </TableCell>
              </TableRow>
            )}
              */}
          </TableBody>
        </Table>
      </TableContainer>
      {/*
      {creating ? (
        <Grid item>
          <Grid container justify='space-between'>
            <Grid item>
              <AdminAutoCompleteField
                addEnabled={true}
                addNew={handleTagCreate}
                close={tagSearch.closeTagSearchResults}
                defaultValue=''
                fieldTitle={'Tag name'} 
                search={tagSearch.delayedTagQuery}
                select={handleTagSelect}
                options={[...tagSearch.tagResultNames]}
              />
            </Grid>
            <Grid item>
              <IconButton
                onClick={handleCreatingState}
                title='Cancel tag creation'
              >
                <CancelRoundedIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid item>
          {props.existing && props.existing.length > 0 ? (
            <React.Fragment>
              {props.existing.map((tag: Tag) => (
                <Grid container>
                  <Grid item>
                    {tag.name}
                  </Grid> 
                  <Grid>
                    <IconButton
                      title={`Edit ${tag.name} ${tag.association} tag`}
                    />
                  </Grid>
                </Grid>
              ))}
            </React.Fragment>
          ) : (
            <Grid item>
              <IconButton 
                onClick={handleCreatingState}
                title={`Add ${TagAssociation} tag`}
              >
                <AddCircleRoundedIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
      )}
      */}
    </Grid>
  );
}

/**
 * Map the redux state to the product form properties.
 *
 */
const mapStateToProps = (state: any, ownProps: AdminManageTagProps): AdminManageTagProps => {
  // Retrieve the xsrf token to be submitted with the request.
  const xsrfToken: string = state.xsrf ? state.xsrf.token : undefined;

  return {
    ...ownProps,
    xsrf: xsrfToken
  };
}

export default connect(
  mapStateToProps
)(AdminManageTag);
