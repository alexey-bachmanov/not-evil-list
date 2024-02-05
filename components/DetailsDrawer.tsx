'use client';
import React from 'react';
import Drawer from './Drawer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, uiActions } from '@/store';

// MUI imports
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

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
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Drawer
      isOpen={isOpen}
      variant="temporary"
      layer={2}
      onClose={() => dispatch(uiActions.setDetailsDrawerOpen(false))}
    >
      {loadingStatus === 'loading' && (
        <CircularProgress
          sx={{
            display: 'block',
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: 'translate(-50% -50%)',
          }}
        />
      )}
      {loadingStatus === 'failure' && error}
      {loadingStatus === 'success' && (
        <>
          <Typography>{business?.companyName}</Typography>
          <Typography>{business?.address}</Typography>
          <Button onClick={() => dispatch(uiActions.setEditsDrawerOpen(true))}>
            Edit
          </Button>
        </>
      )}
    </Drawer>
  );
};

export default DetailsDrawer;
