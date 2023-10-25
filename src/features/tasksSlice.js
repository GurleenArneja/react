import { createSlice } from "@reduxjs/toolkit";

const tasks = {
    "Large Volume Customer Query (Q18)": {},
    "Discounted Revenue Query (Q19)": {},
    "Potential Part Promotion Query (Q20)": {},
    "Suppliers Who Kept Orders Waiting Query (Q21)": {
        stages: 5,
        stageSchema: {
            stage1: "Orders",
            stage2: "Lineitems",
            stage3: "Lineitems",
            stage4: "Q21",
            stage5: "Q21"
        }
    },
    "Global Sales Opportunity Query (Q22)": {}
} 

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: tasks
    }
});

export default tasksSlice.reducer;
