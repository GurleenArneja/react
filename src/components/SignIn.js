import React from 'react';
import {
    Box,
    Container,
    CssBaseline,
    Avatar,
    Typography,
    TextField,
    Button
  } from "@mui/material";

import {
    FaLock
} from 'react-icons/fa';

import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();
  const { users, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

    if(isLoggedIn) {
      dispatch(logout(null));
    }

    const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const username = data.get('username');
      const password = data.get('password');
      if (password === users[username]) {
        dispatch(login(username));
        navigate("/tpch");
      } else {
        alert('Invalid credentials');
      }
    };
  
    return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <FaLock />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
    );
  }

export default SignIn;
