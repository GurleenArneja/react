import React from 'react';

import {
    Grid,
    Paper
  } from "@mui/material";

const Queries = () => {
    return (
        <Grid item xs={12} md={4} lg={3}>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 470,
                }}
            >
            </Paper>
        </Grid>
    );
};

export default Queries;
