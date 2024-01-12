'use client';
import React, { useState } from 'react';
import Logo from '@/components/Logo';

// MUI imports
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const NewBusinessPage: React.FC = function () {
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    addressCity: '',
    addressState: '',
    addressZip: '',
    phone: '',
    website: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    const response = await fetch('/api/businesses', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // TODO: error handling
    // TODO: user feedback based on response
  };

  return (
    <Container component="main" maxWidth="sm">
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
          <Grid item xs={12} sm={7}>
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
          <Grid item xs={4} sm={2}>
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
          {/* ZIPCODE */}
          <Grid item xs={8} sm={3}>
            <TextField
              name="zip"
              required
              id="zip"
              label="Zip Code"
              fullWidth
              value={formData.addressZip}
              onChange={(e) => {
                setFormData({ ...formData, addressZip: e.target.value });
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
          type="submit"
          variant="outlined"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default NewBusinessPage;
