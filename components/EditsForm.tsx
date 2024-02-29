// we're using this component to play hacky games with our redux
// state and local component state
// since Drawer unmounts all its children on close, this component will
// be unmounted and lose all its state. When the drawer opens again, this
// component will mount, check the redux store to initially populate the
// text fields, and then keep form data as a local state, as it should
// hitting the submit button will call the onSubmit function in the higher
// level component (in this case, EditsDrawer)
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, adminActions, uiActions } from '@/store';
import { tags } from '@/types';

// MUI imports
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

const EditsForm: React.FC = function () {
  // check our redux store for the business details to initially populate our form
  const initialState = useSelector(
    (state: RootState) => state.search.businessDetails.details
  );
  // map that initial state onto our formData state
  const [formData, setFormData] = useState({
    companyName: initialState?.companyName || '',
    address: initialState?.address || '',
    addressCity: initialState?.addressCity || '',
    addressState: initialState?.addressState || '',
    phone: initialState?.phone || '',
    website: initialState?.website || '',
    description: initialState?.description || '',
    tags: initialState?.tags || [],
  });
  const [submitState, setSubmitState] = useState<'idle' | 'submitting'>('idle');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState('submitting');
    await dispatch(
      adminActions.editBusiness({ businessId: initialState?._id, formData })
    );
    dispatch(uiActions.setSelectedBusinessId(null));
    setSubmitState('idle');
  };

  const typoMargins = 1;
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: typoMargins }}>
      {/* COMPANY NAME */}
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
        sx={{ marginTop: typoMargins, marginBottom: typoMargins }}
      />
      {/* ADDRESS */}
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
        sx={{ marginTop: typoMargins, marginBottom: typoMargins }}
      />
      {/* CITY */}
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
        sx={{ marginTop: typoMargins, marginBottom: typoMargins }}
      />
      {/* STATE */}
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
        sx={{ marginTop: typoMargins, marginBottom: typoMargins }}
      />
      {/* PHONE */}
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
        sx={{ marginTop: typoMargins, marginBottom: typoMargins }}
      />
      {/* WEBSITE */}
      <TextField
        name="website"
        id="website"
        label="Website"
        fullWidth
        value={formData.website}
        onChange={(e) => {
          setFormData({ ...formData, website: e.target.value });
        }}
        sx={{ marginTop: typoMargins, marginBottom: typoMargins }}
      />
      {/* DESCRIPTION */}
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
        sx={{ marginTop: typoMargins, marginBottom: typoMargins }}
      />
      {/* TAGS */}
      <Autocomplete
        multiple
        id="tags"
        options={tags}
        // freeSolo
        value={formData.tags}
        onChange={(e, newValue) => {
          setFormData({ ...formData, tags: newValue });
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
      <Button
        disabled={submitState === 'idle' ? false : true}
        type="submit"
        variant="outlined"
        fullWidth
        sx={{ mt: 3 }}
      >
        {submitState === 'submitting' ? 'Submitting...' : 'Submit'}
      </Button>
    </Box>
  );
};

export default EditsForm;
