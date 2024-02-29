'use client';
import React, { useState } from 'react';
import Logo from '@/components/Logo';
import { Tag, tags } from '@/types';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, createNewBusinessActions, RootState } from '@/store';

// MUI imports
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MuiPhoneNumber from 'material-ui-phone-number-2';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

const NewBusinessPage: React.FC = function () {
  const submitState = useSelector(
    (state: RootState) => state.createNewBusiness.status
  );
  const helperText = useSelector(
    (state: RootState) => state.createNewBusiness.helperText
  );
  const [formData, setFormData] = useState<{
    companyName: string;
    address: string;
    addressCity: string;
    addressState: string;
    phone: string;
    website: string;
    description: string;
    tags: Tag[];
  }>({
    companyName: '',
    address: '',
    addressCity: '',
    addressState: '',
    phone: '',
    website: '',
    description: '',
    tags: [],
  });
  const [touched, setTouched] = useState({
    companyName: false,
    address: false,
    addressCity: false,
    addressState: false,
    phone: false,
    website: false,
    description: false,
    tags: false,
  });
  // derived state
  const helperTextIsEmpty = Object.values(helperText).every(
    (val) => val === ''
  );
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(createNewBusinessActions.submit(formData));
    if (result.meta.requestStatus === 'fulfilled') {
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
              onBlur={() => {
                dispatch(createNewBusinessActions.validate(formData));
                setTouched({ ...touched, companyName: true });
              }}
              error={touched.companyName && helperText.companyName !== ''}
              helperText={touched.companyName && helperText.companyName}
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
              onBlur={() => {
                dispatch(createNewBusinessActions.validate(formData));
                setTouched({ ...touched, address: true });
              }}
              error={touched.address && helperText.address !== ''}
              helperText={touched.address && helperText.address}
            />
          </Grid>
          {/* CITY */}
          <Grid item xs={9}>
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
              onBlur={() => {
                dispatch(createNewBusinessActions.validate(formData));
                setTouched({ ...touched, addressCity: true });
              }}
              error={touched.addressCity && helperText.addressCity !== ''}
              helperText={touched.addressCity && helperText.addressCity}
            />
          </Grid>
          {/* STATE */}
          <Grid item xs={3}>
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
              onBlur={() => {
                dispatch(createNewBusinessActions.validate(formData));
                setTouched({ ...touched, addressState: true });
              }}
              error={touched.addressState && helperText.addressState !== ''}
              helperText={touched.addressState && helperText.addressState}
            />
          </Grid>
          {/* PHONE */}
          <Grid item xs={12} sm={5}>
            <MuiPhoneNumber
              name="phone"
              required
              id="phone"
              label="Phone"
              defaultCountry="us"
              variant="outlined"
              fullWidth
              value={formData.phone}
              onChange={(val) => {
                setFormData({ ...formData, phone: val as string });
              }}
              onBlur={() => {
                dispatch(createNewBusinessActions.validate(formData));
                setTouched({ ...touched, phone: true });
              }}
              error={touched.phone && helperText.phone !== ''}
              helperText={touched.phone && helperText.phone}
            />
          </Grid>
          {/* WEBSITE */}
          <Grid item xs={12} sm={7}>
            <TextField
              name="website"
              id="website"
              label="Website"
              fullWidth
              value={formData.website}
              onChange={(e) => {
                setFormData({ ...formData, website: e.target.value });
              }}
              onBlur={() => {
                dispatch(createNewBusinessActions.validate(formData));
                setTouched({ ...touched, website: true });
              }}
              error={touched.website && helperText.website !== ''}
              helperText={touched.website && helperText.website}
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
              onBlur={() => {
                dispatch(createNewBusinessActions.validate(formData));
                setTouched({ ...touched, description: true });
              }}
              error={touched.description && helperText.description !== ''}
              helperText={touched.description && helperText.description}
            />
          </Grid>
          {/* TAGS */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              id="tags"
              options={tags}
              value={formData.tags}
              onChange={(e, newValue) => {
                // we want to immediately re-validate on tag change
                setFormData({ ...formData, tags: newValue });
                dispatch(
                  createNewBusinessActions.validate({
                    ...formData,
                    tags: newValue,
                  })
                );
                setTouched({ ...touched, tags: true });
              }}
              onBlur={() => {
                dispatch(createNewBusinessActions.validate(formData));
                setTouched({ ...touched, tags: true });
              }}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={index}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Tags" placeholder="Tags" />
              )}
            />
            {/* ghetto helper text for tags */}
            {touched.tags && (
              <Typography variant="caption" ml={1.5} mr={1.5}>
                {helperText.tags}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Button
          disabled={submitState !== 'idle' || !helperTextIsEmpty}
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
