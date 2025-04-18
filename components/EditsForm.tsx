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
import { formatPhoneNumber, isValidPhoneNumber } from '@/lib/phoneFormatUtils';

// MUI imports
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MuiPhoneNumber from 'material-ui-phone-number-2';
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
    phone: formatPhoneNumber(initialState?.phone) || '',
    website: initialState?.website || '',
    description: initialState?.description || '',
    tags: initialState?.tags || [],
  });
  const [submitState, setSubmitState] = useState<'idle' | 'submitting'>('idle');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // redundant guard clause
    if (!initialState?._id) {
      dispatch(
        uiActions.openAlert({ type: 'error', message: 'Something went wrong' })
      );
      return;
    }
    setSubmitState('submitting');
    await dispatch(
      adminActions.editBusiness({ businessId: initialState?._id, formData })
    );
    dispatch(uiActions.setSelectedBusinessId(undefined));
    setSubmitState('idle');
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
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
      />
      {/* PHONE */}
      <MuiPhoneNumber
        name="phone"
        required
        id="phone"
        label="Phone"
        fullWidth
        variant="outlined"
        value={formData.phone}
        onChange={(val) => {
          setFormData({ ...formData, phone: val as string });
        }}
        onBlur={() => {
          setFormData({
            ...formData,
            phone: isValidPhoneNumber(formData.phone)
              ? (formatPhoneNumber(formData.phone) as string)
              : '',
          });
        }}
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
