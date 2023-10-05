import React from 'react';
import HeaderLinks from './HeaderLinks';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from "@mui/material";

import { useSelector } from "react-redux";

const Documents = () => {
  const { tables } = useSelector((state) => state.tpch);
  return (
    <>
      <HeaderLinks header="Documents" />
      <div className='mainContent'>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {tables.map((table, index) => {
            return <ListItem key={index}>
              <ListItemAvatar>
                <Avatar>
                  20
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={table}/>
            </ListItem>
          })}
        </List>
      </div>
    </>
  );
};

export default Documents;
