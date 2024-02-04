import React from 'react';
import { BusinessDataEntry } from '@/types';
import { useDispatch } from 'react-redux';
import { AppDispatch, searchActions, uiActions } from '@/store';

// MUI imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const formatPhoneNumber = function (num: String) {
  const numString = String(num);
  return `\(${numString.slice(0, 3)}\) ${numString.slice(
    3,
    6
  )}-${numString.slice(6)}`;
};

const SearchResult: React.FC<{ business: BusinessDataEntry }> = function ({
  business,
}) {
  const dispatch = useDispatch<AppDispatch>();
  // handlers
  const handleClick = () => {
    // open the detail drawer and start loading
    dispatch(uiActions.setDetailsDrawerOpen(true));
    dispatch(searchActions.getDetails(business._id));
  };

  const typoMargins = 1;
  return (
    <Box component="li">
      <Grid container component="button" spacing={0} onClick={handleClick}>
        <Grid item xs={12}>
          <Typography variant="h6" marginLeft={typoMargins}>
            {business.companyName}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption" marginLeft={typoMargins}>
            {business.address}
          </Typography>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <Typography variant="caption" marginRight={typoMargins}>
            {formatPhoneNumber(business.phone)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" margin={typoMargins}>
            {business.description}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchResult;
