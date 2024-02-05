'use client';
import React, { useState } from 'react';
import Drawer from './Drawer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, uiActions } from '@/store';

// MUI imports
import Typography from '@mui/material/Typography';

const EditsDrawer: React.FC = function () {
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    addressCity: '',
    addressState: '',
    phone: '',
    website: '',
    description: '',
  });
  const isOpen = useSelector((state: RootState) => state.ui.editsDrawer.isOpen);
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Drawer
      isOpen={isOpen}
      variant="temporary"
      layer={3}
      onClose={() => dispatch(uiActions.setEditsDrawerOpen(false))}
    >
      <Typography>Edit me</Typography>
    </Drawer>
  );
};

export default EditsDrawer;
