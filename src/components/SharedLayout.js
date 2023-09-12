import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

import { Box, CssBaseline } from "@mui/material";

import { ThemeProvider, createTheme } from '@mui/material/styles';

const defaultTheme = createTheme({ palette: { mode: 'light' } });
const drawerWidth = 240;

const SharedLayout = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Sidebar drawerWidth={drawerWidth} />
        <Outlet />
      </Box>
    </ThemeProvider>
  );
};
export default SharedLayout;
