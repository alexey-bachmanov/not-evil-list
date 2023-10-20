import React from 'react';
import { BusinessDataEntry } from '@/store/resultsSlice';

// MUI imports
import ListItem from '@mui/material/ListItem';
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
  const typoMargins = 1;
  return (
    <Grid container component="li" spacing={1}>
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
        <Divider variant="middle" />
      </Grid>
    </Grid>
  );
};

export default SearchResult;
