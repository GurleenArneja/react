import React from 'react';
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  ListItemButton
} from "@mui/material";

import {
  FaThLarge,
  FaRegChartBar,
  FaChartPie,
  FaFileAlt
} from 'react-icons/fa';

const navbarItems = [
  {
    text: "Dashboard",
    icon: <FaThLarge />,
    path: "/"
  },
  {
    text: "Collections",
    icon: <FaRegChartBar />,
    path: "/collections"
  },
  {
    text: "Tasks",
    icon: <FaChartPie />,
    path: "/tasks"
  },
  {
    text: "Documents",
    icon: <FaFileAlt />,
    path: "/documents"
  }
]

const Sidebar = ({drawerWidth}) => {
  return (
    <Drawer variant="permanent" anchor="left"
      sx={{
        '& .MuiDrawer-paper': {
          position: 'relative',
          whiteSpace: 'nowrap',
          width: drawerWidth,
        },
        boxSizing: 'border-box'
      }}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: [1],
        }}
      >
        <Typography variant="h6" noWrap component="div">
          MTable
        </Typography>
      </Toolbar>

      <Divider />
      <List component="nav">
        {navbarItems.map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton to={item.path}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton >
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
