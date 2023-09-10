import { createSlice } from "@reduxjs/toolkit";
import { orders } from '../orders';

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: orders
    }
});

export default ordersSlice.reducer;
