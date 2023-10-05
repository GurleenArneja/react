import React, { useState, useEffect } from 'react';

import {
    Grid,
    Paper,
    Typography,
    Card,
    CardHeader
} from "@mui/material";

import {
    FaFolder
} from 'react-icons/fa';

const maxItemsToShow = 4;

const DisplaySearchObj = ({ data }) => {
    const displayKeyValue = (key, filterVal) => {
      if (filterVal.value === null) {
        return null; // Skip displaying keys with null values
      }
        const dotIndex = key.indexOf('.');
        const field = dotIndex !== -1 ? key.slice(dotIndex + 1) : key;
        return `"${filterVal.value}" in ${field}`;
      
    };
  
    const filteredItems = Object.entries(data)
      .map(([key, filterVal]) => displayKeyValue(key, filterVal))
      .filter((item) => item !== null);
    
    const displayObject = filteredItems.join(', ');
    return <div className="display-object">
        {filteredItems.length > 0 && <div className='tooltip' title={displayObject}>Search {displayObject}</div>}
    </div>;
  };

const RecentQueries = ({ recentQueries, selectedQuery }) => {
    const [queries, setQueries] = useState(recentQueries);
    // Function to format hours and minutes
    const formatTime = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = (hours % 12 || 12).toString().padStart(2, '0'); // Convert to 12-hour format
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    useEffect(() => {
        // Sort the data by timestamp in descending order (latest first)
        if(recentQueries && recentQueries.length) {
            recentQueries.sort((a, b) => new Date(b.time) - new Date(a.time));
            // Update the state with the sorted data
            setQueries([...recentQueries]);
        }
      },[recentQueries]);

    const handleClick = (query) => {
        selectedQuery(query);
    };

    return (
        <Grid item xs={12} md={4} lg={3}>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 470
                }}
            >
                <Typography variant="h8" style={{ marginBottom: '10px'}}>Recent Queries</Typography>
                {queries?.map((query, index) => {
                    const {time, table, col, order, filters} = query;
                    return index < maxItemsToShow && <Card 
                        onClick={() => handleClick(query)}
                        style={{ marginBottom: '10px', minHeight: '50px', maxHeight: '100px', cursor: 'pointer' }} key={index}>
                        <CardHeader
                            className='recentQueryCard'
                            avatar={<FaFolder />}
                            title={
                                <>
                                    <span>{table}</span>
                                    <span style={{float:'right', fontSize:'11px'}}>{formatTime(time)}</span>
                                </>
                            }
                            subheader={
                                <span>
                                    {(col && order) && ('Sort ' + col + ' in ' + (order === 1 ? ' ascending order' : ' descending order'))}
                                    <DisplaySearchObj data={filters} />
                                </span>
                            }
                        />
                    </Card>
                })}

            </Paper>
        </Grid>
    );
};

export default RecentQueries;
