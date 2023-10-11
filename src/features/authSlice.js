import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { credentials } from "../credentials";
import axios from "axios";

export const setUsersRecentAction = createAsyncThunk(
    'auth/setUsersRecentAction',
    async (query, { getState, rejectWithValue }) => {
        try {
            const userLoggedIn = getState().auth.userLoggedIn;
            const queryParams = {
                user: userLoggedIn,
                query: query
            };
            const response = await axios.post('https://api.example.com/data', queryParams);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        users: credentials,
        isLoggedIn: false,
        userLoggedIn: null
    },
    reducers: {
        login: (state, action) => {
            state.userLoggedIn = action.payload;
            state.isLoggedIn = true;
        },
        logout: (state, action) => {
            state.userLoggedIn = action.payload;
            state.isLoggedIn = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setUsersRecentAction.fulfilled, (state, action) => {
            console.log(action.payload);
        });
        builder.addCase(setUsersRecentAction.rejected, (state, action) => {
            console.error('Error saving data:', action.payload);
        });
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
