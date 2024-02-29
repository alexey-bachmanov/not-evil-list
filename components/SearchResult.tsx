import React from 'react';
import { IBusinessDocument } from '@/models';
import { useDispatch } from 'react-redux';
import { AppDispatch, searchActions, uiActions } from '@/store';
import formatPhoneNumber from '@/lib/formatPhoneNumber';

// MUI imports
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';

const SearchResult: React.FC<{ business: IBusinessDocument }> = function ({
  business,
}) {
  const dispatch = useDispatch<AppDispatch>();
  // handlers
  const handleClick = () => {
    // open the detail drawer and start loading
    dispatch(uiActions.setSelectedBusinessId(business._id));
    dispatch(uiActions.setDetailsDrawerOpen(true));
    dispatch(uiActions.setEditsDrawerOpen(false));
    dispatch(searchActions.getDetails(business._id));
  };

  const typoMargins = 1;
  return (
    <ListItemButton component="li">
      <Grid container spacing={0} onClick={handleClick}>
        {/* COMPANY NAME */}
        <Grid item xs={12}>
          <Typography variant="h6" marginLeft={typoMargins}>
            {business.companyName}
          </Typography>
          <Divider />
        </Grid>
        {/* RATING */}
        <Grid
          item
          xs={12}
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Rating
            name={`${business.companyName}-rating`}
            value={business.ratingAvg}
            precision={0.1}
            size="small"
            readOnly
            sx={{ marginLeft: typoMargins, marginRight: 0.5 }}
          />
          <Typography variant="caption" sx={{ lineHeight: '18px' }}>
            ({business.ratingQty})
          </Typography>
        </Grid>
        {/* ADDRESS AND PHONE # */}
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
        {/* DESCRIPTION */}
        <Grid item xs={12}>
          <Typography variant="body2" margin={typoMargins}>
            {business.description}
          </Typography>
        </Grid>
      </Grid>
    </ListItemButton>
  );
};

export default SearchResult;
