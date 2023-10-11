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
  FaFileAlt,
  FaSignOutAlt
} from 'react-icons/fa';

import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const navbarItems = [
  {
    text: "Dashboard",
    icon: <FaThLarge />,
    path: "/tpch"
  },
  {
    text: "Collections",
    icon: <FaRegChartBar />,
    path: "/tpch/collections"
  },
  {
    text: "Tasks",
    icon: <FaChartPie />,
    path: "/tpch/tasks"
  },
  {
    text: "Documents",
    icon: <FaFileAlt />,
    path: "/tpch/documents"
  },
  {
    text: "Logout",
    icon: <FaSignOutAlt />,
    path: "/logout"
  }
]

const Sidebar = ({ drawerWidth }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    navigate('/');
  }
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
        {navbarItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton>
              <Link to={item.path} style={{textDecoration: 'none', color: 'inherit'}}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text}/>
              </Link>
            </ListItemButton >
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
