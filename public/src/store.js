import { configureStore } from "@reduxjs/toolkit";
import tpchReducer from './features/tpchSlice'
import ordersReducer from "./features/ordersSlice";
import tasksReducer from './features/tasksSlice';

export const store = configureStore({
    reducer: {
        tpch: tpchReducer,
        orders: ordersReducer,
        tasks: tasksReducer
    }
});
