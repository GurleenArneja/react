import { createSlice } from "@reduxjs/toolkit";

const tasks = [
    "Suppliers Who Kept Orders Waiting Query (Q21)"
]

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: tasks
    }
});

export default tasksSlice.reducer;
