import React, { useState, useEffect } from 'react';
import HeaderLinks from './HeaderLinks';

import {
  Box,
  Container,
  Grid,
  Paper,
  Toolbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";

import { useSelector } from "react-redux";
import axios from 'axios';

const Tasks = () => {
  const { orders } = useSelector((state) => state.orders);
  const { tasks } = useSelector((state) => state.tasks);
  const [taskSelected, setTaskSelected] = useState("");
  const [nation, setNation] = useState();
  const [nationSelected, setNationSelected] = useState("");
  const [queryData, setQueryData] = useState();

  const getUniqueObjects = (originalArray, key) => {
    const uniqueKeys = new Set();
    const uniqueArray = [];

    originalArray.forEach(obj => {
      if (!uniqueKeys.has(obj[key])) {
        uniqueKeys.add(obj[key]);
        uniqueArray.push(obj['nation_name']);
      }
    });
    return uniqueArray;
  };

  function getNation() {
    const combinedNationObjects = orders.flatMap(order => [
      order.customer_info.nation,
      order.lineitems.flatMap((lineitem) => [
          lineitem.partsupp.supplier_info.nation
      ])
    ]);
    const flatNationArray = combinedNationObjects.flat(Infinity);
    const uniqueNations = getUniqueObjects(flatNationArray, 'nation_key');
    return uniqueNations;
  }

  useEffect(()=> {
    const nationArr = getNation();
    setNation(nationArr);
  },[taskSelected]);

  useEffect(()=> {
    if (taskSelected && nationSelected) {
      axios.get('https://api.example.com/data', { nationSelected })
      .then((response) => {
        console.log(response.data);
        setQueryData({ data: response.data });
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error('Error fetching data:', error);
      });
    }
  },[nationSelected]);

  return (
    <>
      <HeaderLinks header="Tasks"/>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 470,
                }}
            >
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>Queries</InputLabel>
                <Select
                      value={taskSelected}
                      onChange={(event) => setTaskSelected(event.target.value)}
                      label="Queries"
                      >
                          {tasks.map((value) => {
                              return (<MenuItem key={value} value={value}>{value}</MenuItem>)
                          })}
                  </Select>
              </FormControl>
              {taskSelected && <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>Select Nation</InputLabel>
                <Select
                      value={nationSelected}
                      onChange={(event) => setNationSelected(event.target.value)}
                      label="Queries"
                      >
                          {nation.map((value) => {
                              return (<MenuItem key={value} value={value}>{value}</MenuItem>)
                          })}
                  </Select>
              </FormControl>}
            </Paper>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Tasks;
