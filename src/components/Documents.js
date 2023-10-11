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
import { useNavigate } from 'react-router-dom';

const Documents = () => {
  const { tables } = useSelector((state) => state.tpch);
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    navigate('/');
  }
  return (
    <>
      <HeaderLinks header="Documents" />
      <div className='mainContent'>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          <ListItem>
              <ListItemAvatar>
                <Avatar style={{width: "60px", height: '60px'}}>
                  1500
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Orders" style={{paddingLeft: "10px"}}/>
            </ListItem>
        </List>
      </div>
    </>
  );
};

export default Documents;
