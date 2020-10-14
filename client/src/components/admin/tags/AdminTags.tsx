/**
 * AdminTags.tsx
 * Renders the component displaying app tags.
 */

// Modules.
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import API from '../../../utils/api/Api.model';
import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
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
import LinkOffRoundedIcon from '@material-ui/icons/LinkOffRounded';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';
import {
  useSnackbar,
  VariantType
} from 'notistack';

// Components.
import AdminManageTag from './AdminManageTag';
import AdminAutoCompleteField from '../autocompleteField/AdminAutoCompleteField';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RequestType } from '../../../utils/api/Api.enum';
import { SortDirection } from '../Sort.enum';
import { TagAssociation } from '../../tag/Tag.enum';

// Hooks.
import { useAutocompleteTagSearch } from '../../tag/search/useAutocompleteTagSearch.hook';
import { useRetrieveTagsList } from './useRetrieveTagsList.hook';

// Interfaces.
import { AdminTagsProps } from './AdminTags.interface';
import {
  AddTagFormResponse,
  Tag
} from '../../tag/Tag.interface';

/**
 * Create styles for the tags screen.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  boldText: {
    fontWeight: 700
  },
  leftMargin: {
    marginLeft: theme.spacing(2)
  },
  tableContainer: {
    //maxHeight: `calc(100vh - 250px)`
  },
  toolbar: {
    marginBottom: theme.spacing(2)
  },
  editContainer: {
    padding: theme.spacing(2)
  },
  headerCell: {
    backgroundColor: `#F1F1F1`,
    borderBottom: `1px solid rgba(200,200,200)`,
    fontWeight: 800,
    textTransform: 'uppercase'
  },
  modal: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
  modalContainer: {
    height: '100vh',
    outline: 0,
    overflowY: 'auto',
    width: '100vw'
  },
  modalContentContainer: {
  },
  modalFieldButton: {
    lineHeight: '2.8rem'
  },
  modalFieldContainer: {
    flexGrow: 1,
    paddingRight: theme.spacing(1)
  },
  modalMargin: {
    margin: theme.spacing(2)
  },
  modalPadding: {
    padding: theme.spacing(2, 0)
  },
  modalTitleContainer: {
    margin: theme.spacing(2, 0)
  },
  tableCell: {
    backgroundColor: 'transparent'
  },
  tableRow: {
    '&:hover': {
      backgroundColor: `rgba(250, 250, 250)`
    }
  }
}));

/**
 * Renders the list of tags for the admin screen.
 */
const AdminTags: React.FC<AdminTagsProps> = (props: AdminTagsProps) => {
  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  // Set the open state of the modal.
  const [open, setOpen] = React.useState<boolean>(false);

  // Register the snackbar.
  const { enqueueSnackbar } = useSnackbar();

  const [current, setCurrent] = React.useState<Tag | null>(null);
  const [linkFrom, setLinkFrom] = React.useState<Tag | null>(null);

  // Retrieves the list of product tags.
  const productTags = useRetrieveTagsList({
    sort: {
      name: SortDirection.DESCENDING
    },
    filters: {
      association: TagAssociation.PRODUCT
    }
  });

  // Use the autocomplete search hook for product type search requests.
  const categoryTags = useAutocompleteTagSearch({
    association: TagAssociation.CATEGORY
  });

  // Form error messages to be displayed if fields haven't been validated
  // and prevents submissions to the api.
  const [formErrorMessages, setFormErrorMessages] = React.useState(['']);

  // Set a form submission state, used to inform the user their form has been
  // submitted and to prevent duplicate submissions.
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  
  /**
   * Handles closing the overlay and reseting the tag results.
   */
  const refreshTags: (
  ) => void = (
  ): void => {
    // Reset the tag values.
    setCurrent(null);
    setLinkFrom(null);
    productTags.reset();
    setOpen(false);
  }
  /**
   * Handles the display for adding this product to a collection.
   */
  const handleOverlay: (
  ) => void = (
  ): void => {
    setOpen(!open);
  }

  /**
   * Handles the setup of the tag editing.
   *
   * @param { Tag } current - the current tag.
   * @param { Tag } linkFrom - the link from tag.
   */
  const handleEdit: (
    current: Tag | null
  ) => (
    linkFrom: Tag | null
  ) => void = (
    current: Tag | null
  ) => (
    linkFrom: Tag | null
  ): void => {
    
    // Set the necessary tag values.
    setCurrent(current || null);
    setLinkFrom(linkFrom || null);

    handleOverlay();
  }

  /**
   * Handles the unlinking of a tag.
   *
   * @param { Tag } current - the current tag.
   * @param { Tag } linkFrom - the link from tag.
   */
  const handleUnlink: (
    current: Tag | null
  ) => (
    linkFrom: Tag | null
  ) => void = (
    current: Tag | null
  ) => (
    linkFrom: Tag | null
  ): void => {

    // Don't do anything if we're already submitting.
    if (submitting || !linkFrom || !current) {
      return;
    }

    // Set the submission state.
    setSubmitting(true);

    API.requestAPI<AddTagFormResponse>('tag/unlink', {
      method: RequestType.POST,
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      body: JSON.stringify({
        id: linkFrom._id,
        linkFrom: current._id
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

      setSubmitting(false);

      refreshTags();
    })
    .catch((error: Error) => {
      enqueueSnackbar(`There was a problem updating ${name}`, { variant: 'error'});
      setSubmitting(false);
    });
  }

  /**
   * Handles a new category creation.
   *
   * @param { string } name - the name of the category to create.
   */
  const handleCategoryCreate: (
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
        association: TagAssociation.CATEGORY,
        linkFrom: linkFrom
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

      setSubmitting(false);

      refreshTags();
    })
    .catch((error: Error) => {
      enqueueSnackbar(`There was a problem updating ${name}`, { variant: 'error'});
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
    const selectedTagId: string = categoryTags.tagResults[index]._id;

    // Don't do anything if we're already submitting.
    if (submitting || !linkFrom) {
      return;
    }

    // Set the submission state.
    setSubmitting(true);

    API.requestAPI<AddTagFormResponse>('tag/update', {
      method: RequestType.POST,
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      body: JSON.stringify({
        id: linkFrom._id,
        linkFrom: selectedTagId
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

      setSubmitting(false);

      refreshTags();
    })
    .catch((error: Error) => {
      enqueueSnackbar(`There was a problem updating ${name}`, { variant: 'error'});
      setSubmitting(false);
    });
  }

  /**
   * Handles renaming the existing tag.
   *
   * @param { number } index - the index of the selected tag.
   */
  const handleTagRename: (
  ) => void = (
  ): void => {

    // Don't do anything if we're not editing an existing tag.
    if (submitting || !current || !categoryTags.tagQuery) {
      return;
    }

    // Set the submission state.
    setSubmitting(true);

    API.requestAPI<AddTagFormResponse>('tag/update', {
      method: RequestType.POST,
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      body: JSON.stringify({
        id: current._id,
        name: categoryTags.tagQuery
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

      setSubmitting(false);

      refreshTags();
    })
    .catch((error: Error) => {
      enqueueSnackbar(`There was a problem updating ${name}`, { variant: 'error'});
      setSubmitting(false);
    });
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid
          alignItems='center'
          container
          className={clsx(classes.toolbar)}
          justify='space-between'
        >
          <Grid item>
            Filter options
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {productTags.tags.length > 0 &&
          <Paper>
            <TableContainer className={clsx(classes.tableContainer)}>
              <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell className={clsx(classes.headerCell)}>
                        Product types
                      </TableCell>
                    </TableRow>
                  </TableHead>
                <TableBody>
                  <TableRow className={clsx(classes.tableRow)}>
                    <TableCell component='th' scope='row' className={clsx(classes.tableCell)}>
                      <TreeView
                        multiSelect
                      >
                        {productTags.tags.map((productType: Tag) => (
                          <TreeItem
                            key={productType._id}
                            label={productType.name}
                            nodeId={productType._id}
                          >
                            {productType.linkFrom && productType.linkFrom.length > 0 &&
                              <React.Fragment>
                                {productType.linkFrom.map((subCategory: Tag) => (
                                  <TreeItem
                                    key={subCategory._id}
                                    label={
                                      <Grid container alignItems='center'>
                                        <Grid item>
                                          {subCategory.name}
                                        </Grid>
                                        <Grid item>
                                          <IconButton
                                            title={`Edit the ${subCategory.name} tag`}
                                            onClick={() => handleEdit(subCategory)(productType)}
                                          >
                                            <EditRoundedIcon />
                                          </IconButton>
                                        </Grid>
                                        <Grid item>
                                          <IconButton
                                            title={`Unlink the ${subCategory.name} tag`}
                                            onClick={() => handleUnlink(subCategory)(productType)}
                                          >
                                            <LinkOffRoundedIcon />
                                          </IconButton>
                                        </Grid>
                                      </Grid>
                                    }
                                    nodeId={subCategory._id}
                                  />
                                ))}
                              </React.Fragment>
                            }
                            <Button
                              className={clsx(classes.leftMargin)}
                              onClick={() => handleEdit(null)(productType)}
                              startIcon={<AddRoundedIcon />}
                            >
                              Add sub-category 
                            </Button>
                          </TreeItem>
                        ))}
                      </TreeView>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        }
      </Grid>
      <Modal
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300
        }}
        className={clsx(classes.modal)}
        closeAfterTransition
        open={open}
        onClose={handleOverlay}
      >
        <Paper className={clsx(classes.modalContainer)}>
          <Grid
            alignItems='stretch'
            className={clsx(classes.editContainer)}
            container
            justify='center'
          >
            <Grid item xs={12} lg={6}>
              <Grid
                alignItems='center'
                className={clsx(
                  classes.modalPadding,
                  classes.modalTitleContainer
                )}
                container
                justify='space-between'
              >
                <Grid item>
                  {current ? (
                    <Typography variant='h2'>
                      Update {current.name} tag
                    </Typography>
                  ) : (
                    <Typography variant='h2'>
                      Select or create a new tag
                    </Typography>
                  )}
                </Grid>
                <Grid item>
                  <StyledButton
                    title='cancel'
                    clickAction={handleOverlay}
                    variant='outlined'
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} className={clsx(
                classes.modalPadding,
                classes.modalMargin
              )}>
                <Typography variant='body1'>
                  <Box component='span' className={clsx(classes.boldText)}>Links from:</Box> {linkFrom ? linkFrom.name : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item className={clsx(classes.modalFieldContainer)}>
                    <AdminAutoCompleteField
                      addEnabled={true}
                      addNew={handleCategoryCreate}
                      close={categoryTags.closeTagSearchResults}
                      defaultValue={current ? current.name : ''}
                      fieldTitle={'Category'}
                      search={categoryTags.delayedTagQuery}
                      select={handleTagSelect}
                      options={[...categoryTags.tagResultNames]}
                    /> 
                  </Grid>
                  {current &&
                    <Grid item>
                      <StyledButton
                        className={clsx(classes.modalFieldButton)}
                        title='Rename'
                        clickAction={handleTagRename}
                      />
                    </Grid>
                  }
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </Grid>
  );
}

/**
 * Map the redux state to the product form properties.
 *
 */
const mapStateToProps = (state: any, ownProps: AdminTagsProps): AdminTagsProps => {
  // Retrieve the xsrf token to be submitted with the request.
  const xsrfToken: string = state.xsrf ? state.xsrf.token : undefined;

  return {
    ...ownProps,
    xsrf: xsrfToken
  };
}

export default withRouter(connect(
  mapStateToProps
)(AdminTags));
