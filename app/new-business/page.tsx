'use client';
import React from 'react';
import Logo from '@/components/Logo';
import Providers from '@/store/providers';

// MUI imports
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const NewBusinessPage: React.FC = function () {
  const handleSubmit = () => {};

  return (
    <Providers>
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
              />
            </Grid>
            {/* ADDRESS */}
            <Grid item xs={12} sm={7}>
              <TextField
                name="address"
                required
                id="address"
                label="Address"
                fullWidth
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
              />
            </Grid>
            {/* WEBSITE */}
            <Grid item xs={12} sm={8}>
              <TextField
                name="website"
                required
                id="website"
                label="Website"
                fullWidth
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
    </Providers>
  );
};

export default NewBusinessPage;
