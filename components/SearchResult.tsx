import React from 'react';
import { BusinessDataEntry } from '@/store/resultsSlice';

// MUI imports
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const formatPhoneNumber = function (num: Number) {
  const numString = String(num);
  return `\(${numString.slice(0, 3)}\) ${numString.slice(
    3,
    6
  )}-${numString.slice(6)}`;
};

const SearchResult: React.FC<{ business: BusinessDataEntry }> = function ({
  business,
}) {
  return (
    <>
      <Divider variant="middle" />
      <ListItem>
        <ListItemText />
        <Typography variant="h6">{business.companyName}</Typography>
        <Typography variant="caption">{business.address}</Typography>
        <Typography variant="caption">
          {formatPhoneNumber(business.phone)}
        </Typography>
        <Typography variant="caption">{business.website}</Typography>
        <Typography variant="caption">{business.description}</Typography>
      </ListItem>
    </>
  );
};

export default SearchResult;
