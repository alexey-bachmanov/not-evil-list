import React from 'react';
import { IReviewDocument } from '@/models';
// mongoose.ObjectId is a *type*, mongoose.Types.ObjectId is a *class constructor*
import { ObjectId, Types } from 'mongoose';

// MUI imports
import ListItem from '@mui/material/ListItem';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const Review: React.FC<{ review: IReviewDocument }> = function ({ review }) {
  // extract user data - we have to confirm that the document returned to us has actually been populated
  // with user data
  let user: { _id: ObjectId | null; userName: string };
  if (review.user) {
    user = review.user;
  } else {
    user = { _id: null, userName: 'Default User' };
  }
  // extract date - it's stored as a string-like object in mongoDB, without
  // any methods attached
  let date: Date;
  if (review.createdAt) {
    date = new Date(review.createdAt);
  } else {
    date = new Date(Date.now());
  }
  return (
    <ListItem>
      <Grid container spacing={1}>
        {/* USER AVATAR AND NAME */}
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Avatar alt={`${user.userName} avatar`}>
            {user.userName.slice(0, 1).toUpperCase()}
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              flexBasis: '100%',
              paddingLeft: 1,
              textWrap: 'nowrap',
            }}
          >
            {user.userName}
          </Typography>
        </Grid>

        {/* RATING AND DATE */}
        <Grid item xs={6}>
          <Rating readOnly value={review.rating} size="small" />
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Typography variant="subtitle2">
            {date.toLocaleDateString()}
          </Typography>
        </Grid>

        {/* REVIEW TEXT */}
        <Grid item xs={12}>
          <Typography variant="body2">{review.review}</Typography>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default Review;
