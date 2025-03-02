'use client';
import React from 'react';
import Drawer from './Drawer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, uiActions, adminActions } from '@/store';
import { formatPhoneNumber } from '@/lib/phoneFormatUtils';
import Review from './Review';

// MUI imports
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Chip from '@mui/material/Chip';

const DetailsDrawer: React.FC = function () {
  const loadingStatus = useSelector(
    (state: RootState) => state.search.businessDetails.status
  );
  const error = useSelector(
    (state: RootState) => state.search.businessDetails.error
  );
  const business = useSelector(
    (state: RootState) => state.search.businessDetails.details
  );
  const isOpen = useSelector(
    (state: RootState) => state.ui.detailsDrawer.isOpen
  );
  const userRole = useSelector((state: RootState) => state.auth.user.role);
  const isInAdminMode = useSelector(
    (state: RootState) => state.admin.isInAdminMode
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleClose = () => {
    dispatch(uiActions.setDetailsDrawerOpen(false));
    dispatch(uiActions.setSelectedBusinessId(undefined));
  };

  const successContentsJSX = (
    <>
      {/* TITLE */}
      <Typography variant="h6" sx={{ marginTop: 1 }}>
        {business?.companyName}
      </Typography>
      <Divider variant="middle" />

      {/* TAGS */}
      <List
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          listStyle: 'none',
          m: 0,
          p: 0,
        }}
      >
        {business?.tags.map((tag, index) => (
          <ListItem key={index} sx={{ m: 0.5, p: 0, width: 'fit-content' }}>
            <Chip label={tag} size="small" />
          </ListItem>
        ))}
      </List>
      <Divider variant="middle" />

      {/* OVERVIEW */}
      <Typography variant="caption" textAlign="right">
        Overview
      </Typography>
      <Typography variant="body2">{business?.description}</Typography>
      <Divider variant="middle" />

      {/* DETAILS */}
      <Typography variant="caption" textAlign="right">
        Details
      </Typography>
      <Typography variant="subtitle2">{business?.address}</Typography>
      <Typography variant="subtitle2">{`${business?.addressCity}, ${business?.addressState} ${business?.addressZip}`}</Typography>
      <Typography variant="subtitle2">
        {formatPhoneNumber(business?.phone)}
      </Typography>
      <Divider variant="middle" />

      {/* REVIEWS */}
      <Typography variant="caption" textAlign="right">
        Reviews
      </Typography>
      <Rating
        name={`${business?.companyName}-rating`}
        value={business?.ratingAvg}
        precision={0.1}
        readOnly
        sx={{ marginLeft: 'auto', marginRight: 'auto' }}
      />
      <List sx={{ flexBasis: '100%', overflowY: 'auto' }}>
        {business?.reviews?.map((review) => (
          <Review key={review._id} review={review} />
        ))}
      </List>

      {/* ADMIN ACTION BUTTONS */}
      {userRole === 'admin' && isInAdminMode && !business?.isVerified && (
        <Button
          fullWidth
          variant="outlined"
          onClick={() => dispatch(adminActions.approveBusiness())}
        >
          Verify
        </Button>
      )}
      {userRole === 'admin' && isInAdminMode && (
        <ButtonGroup fullWidth>
          <Button onClick={() => dispatch(uiActions.setEditsDrawerOpen(true))}>
            Edit
          </Button>
          <Button
            onClick={() => {
              // redundant guard clause
              if (!business?._id) {
                dispatch(
                  uiActions.openAlert({
                    type: 'error',
                    message: 'Something went wrong',
                  })
                );
                return;
              }
              dispatch(adminActions.deleteBusiness(business?._id));
            }}
          >
            Delete
          </Button>
        </ButtonGroup>
      )}
    </>
  );

  return (
    <Drawer
      isOpen={isOpen}
      variant="temporary"
      layer={2}
      onClose={handleClose}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: 1,
        height: '100%',
      }}
    >
      {loadingStatus === 'loading' && (
        <Stack alignItems="center" justifyContent="center" height="100%">
          <CircularProgress />
        </Stack>
      )}
      {loadingStatus === 'failure' && error}
      {loadingStatus === 'success' && successContentsJSX}
    </Drawer>
  );
};

export default DetailsDrawer;
