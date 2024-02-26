'use client';
import React from 'react';
import Drawer from './Drawer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, uiActions, adminActions } from '@/store';
import formatPhoneNumber from '@/lib/formatPhoneNumber';
import Review from './Review';

// MUI imports
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import List from '@mui/material/List';

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
    dispatch(uiActions.setSelectedBusinessId(null));
  };

  const typoMargins = 1;
  const sectionGap = 1.5;
  const successContentsJSX = (
    <>
      {/* TITLE */}
      <Typography variant="h6">{business?.companyName}</Typography>
      <Divider variant="middle" sx={{ marginTop: sectionGap }} />

      {/* TAGS */}
      <Typography variant="caption">Tags go here...</Typography>
      <Divider variant="middle" sx={{ marginTop: sectionGap }} />

      {/* OVERVIEW */}
      <Typography variant="caption" textAlign="right">
        Overview
      </Typography>
      <Typography variant="body2">{business?.description}</Typography>
      <Divider variant="middle" sx={{ marginTop: sectionGap }} />

      {/* DETAILS */}
      <Typography variant="caption" textAlign="right">
        Details
      </Typography>
      <Typography variant="subtitle2">{business?.address}</Typography>
      <Typography variant="subtitle2">{`${business?.addressCity}, ${business?.addressState} ${business?.addressZip}`}</Typography>
      <Typography variant="subtitle2">
        {formatPhoneNumber(business?.phone)}
      </Typography>
      <Divider variant="middle" sx={{ marginTop: sectionGap }} />

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
          <Button
            // fullWidth
            onClick={() => dispatch(uiActions.setEditsDrawerOpen(true))}
          >
            Edit
          </Button>
          <Button
            // fullWidth
            onClick={() => dispatch(adminActions.deleteBusiness(business?._id))}
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
        padding: typoMargins,
        height: '100%',
      }}
    >
      {loadingStatus === 'loading' && (
        <CircularProgress
          sx={{
            display: 'block',
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
      {loadingStatus === 'failure' && error}
      {loadingStatus === 'success' && successContentsJSX}
    </Drawer>
  );
};

export default DetailsDrawer;
