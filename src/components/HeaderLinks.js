import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Select,
    MenuItem
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { setTableSelected, clearSelectedCellData } from '../features/tpchSlice';

const drawerWidth = 240;

const HeaderLinks = ({ header }) => {
    const dispatch = useDispatch();
    const { tables, tableSelected } = useSelector((state) => state.tpch);

    const setSelectedTable = (event) => {
        dispatch(clearSelectedCellData());
        dispatch(setTableSelected(event.target.value));
    };

    return (
        <AppBar position="absolute"
            sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
        >
            <Toolbar>
                <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1 }}
                >
                    {header}
                </Typography>
                { header === 'Dashboard' && <Select
                    sx = {{
                        width: '15ch',
                        marginLeft: '1ch',
                        height: '5ch'
                    }}
                    value={tableSelected}
                    onChange={setSelectedTable}
                    >
                        {tables.map((value) => {
                            return (<MenuItem key={value} value={value}>{value}</MenuItem>)
                        })}
                </Select>}
            </Toolbar>
        </AppBar>
    );
};

export default HeaderLinks;
