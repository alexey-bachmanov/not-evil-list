'use client';
import React, { useState } from 'react';
import Logo from '@/components/Logo';
import fetchData from '@/lib/fetchData';
import { AppApiRequest, AppApiResponse } from '@/types';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch, uiActions } from '@/store';

// MUI imports
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const NewBusinessPage: React.FC = function () {
  const [submitState, setSubmitState] = useState<
    'idle' | 'submitting' | 'done'
  >('idle');
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    addressCity: '',
    addressState: '',
    phone: '',
    website: '',
    description: '',
  });
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState('submitting');
    const reply = await fetchData<
      AppApiRequest['postNewBusiness'],
      AppApiResponse['postNewBusiness']
    >('/api/businesses', formData, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!reply.success) {
      setSubmitState('idle');
      dispatch(
        uiActions.openAlert({
          type: 'error',
          message: 'Failed to submit. Try again later',
        })
      );
    } else {
      setSubmitState('done');
      dispatch(
        uiActions.openAlert({
          type: 'success',
          message: 'Business submitted to the database. Thank you!',
        })
      );
      router.replace('/');
    }
  };

  return (
    <Container maxWidth="sm">
      <Logo />
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          {/* COMPANY NAME */}
          <Grid item xs={12}>
            <TextField
              name="companyName"
              required
              id="companyName"
              label="Company Name"
              fullWidth
              autoFocus
              value={formData.companyName}
              onChange={(e) => {
                setFormData({ ...formData, companyName: e.target.value });
              }}
            />
          </Grid>
          {/* ADDRESS */}
          <Grid item xs={12}>
            <TextField
              name="address"
              required
              id="address"
              label="Address"
              fullWidth
              value={formData.address}
              onChange={(e) => {
                setFormData({ ...formData, address: e.target.value });
              }}
            />
          </Grid>
          {/* CITY */}
          <Grid item xs={10}>
            <TextField
              name="city"
              required
              id="city"
              label="City"
              fullWidth
              value={formData.addressCity}
              onChange={(e) => {
                setFormData({ ...formData, addressCity: e.target.value });
              }}
            />
          </Grid>
          {/* STATE */}
          <Grid item xs={2}>
            <TextField
              name="state"
              required
              id="state"
              label="State"
              fullWidth
              value={formData.addressState}
              onChange={(e) => {
                setFormData({ ...formData, addressState: e.target.value });
              }}
            />
          </Grid>
          {/* PHONE */}
          <Grid item xs={12} sm={4}>
            <TextField
              name="phone"
              required
              id="phone"
              label="Phone"
              fullWidth
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
              }}
            />
          </Grid>
          {/* WEBSITE */}
          <Grid item xs={12} sm={8}>
            <TextField
              name="website"
              id="website"
              label="Website"
              fullWidth
              value={formData.website}
              onChange={(e) => {
                setFormData({ ...formData, website: e.target.value });
              }}
            />
          </Grid>
          {/* DESCRIPTION */}
          <Grid item xs={12}>
            <TextField
              name="description"
              required
              id="description"
              label="Description"
              fullWidth
              multiline
              maxRows={4}
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
              }}
            />
          </Grid>
        </Grid>
        <Button
          disabled={submitState === 'idle' ? false : true}
          type="submit"
          variant="outlined"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
        >
          {submitState === 'submitting' ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </Container>
  );
};

export default NewBusinessPage;
