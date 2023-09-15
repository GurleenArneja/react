import { createSlice } from "@reduxjs/toolkit";

const tasks = {
    "Suppliers Who Kept Orders Waiting Query (Q21)": {
        stages: 5,
        stageSchema: {
            stage1: "Orders",
            stage2: "Lineitems",
            stage3: "Lineitems",
            stage4: "Q21",
            stage5: "Q21"
        }
    }
} 

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: tasks
    }
});

export default tasksSlice.reducer;
