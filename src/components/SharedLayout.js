import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

import { Box, CssBaseline } from "@mui/material";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const defaultTheme = createTheme({ palette: { mode: 'light' } });
const drawerWidth = 240;

const SharedLayout = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  // If not logged in, redirect to the login page
  if (!isLoggedIn) {
    navigate("/", { replace: true });
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Sidebar drawerWidth={drawerWidth}/>
        <Outlet />
      </Box>
    </ThemeProvider>
  );
};
export default SharedLayout;
