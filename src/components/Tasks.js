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
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { useSelector } from "react-redux";
import axios from 'axios';
import QueryStage from './QueryStage';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    navigate('/');
  }
  const { orders } = useSelector((state) => state.orders);
  const { tasks } = useSelector((state) => state.tasks);

  const [querySelected, setQuerySelected] = useState("");
  const [nation, setNation] = useState();
  const [nationSelected, setNationSelected] = useState("");
  const [stageSelected, setStageSelected] = useState("stage1");
  const [queryData, setQueryData] = useState();
  const [stageSchema, setStageSchema] = useState();

  const { columns } = useSelector((state) => state.tpch);

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

  useEffect(() => {
    const nationArr = getNation();
    setNation(nationArr);
  }, [querySelected]);

  const getLineItems = (data) => {
    const lineitemData = data.map(order => order.lineitems);
    const flatLineitemData = lineitemData.flat(Infinity);
    return flatLineitemData;
  }

  useEffect(() => {

    if (querySelected && nationSelected) {
      const url = 'http://localhost:8000/get_supplier_info';
      console.log("stageSelected:",stageSelected);
      const queryParams = {
        country_query: nationSelected,
        stage: stageSelected.replace('stage', '')
      };

      // Define the headers
      const headers = {
        'Accept': 'application/json'
      };

      // Make the POST request with query parameters and headers
      axios.post(url, null, { params: queryParams, headers })
        .then((response) => {
          console.log(response.data);
          const schema = tasks[querySelected].stageSchema[stageSelected];
          setStageSchema(schema);

          if(schema === 'Lineitems') {
            const lineitemData = getLineItems(response.data);
            setQueryData(lineitemData);
          }
          else {
            setQueryData(response.data);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          // Handle errors here
        });

    }
  }, [nationSelected, stageSelected]);

  function getStages() {
    const stages = [];
    for (let i = 1; i <= tasks[querySelected].stages; i++) {
      stages.push("stage" + i);
    }
    return stages;
  }

  const selectedStage = (data) => {
    setStageSelected(() => data);
  }

  const renderColumnContent = (rowData, column) => {
    const { field, nestedCol } = column;
    if (rowData) {
      if (nestedCol) {
        if (!field) {
          // only for orders to calculate number of line items
          return (
            <span>
              {rowData[nestedCol].length}
            </span>
          );
        }
        return (
          <span>
            {rowData[nestedCol][field]}
          </span>
        );
      } else {
        return <span>{rowData[field]}</span>;
      }
    }
  };

  return (
    <>
      <HeaderLinks header="Tasks" />
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
                  value={querySelected}
                  onChange={(event) => setQuerySelected(event.target.value)}
                  label="Queries"
                >
                  {Object.keys(tasks).map((value) => {
                    return (<MenuItem key={value} value={value}>{value}</MenuItem>)
                  })}
                </Select>
              </FormControl>
              {querySelected && <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <FormControl variant="standard" sx={{ m: 1, width: '90%' }}>
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
                  </FormControl>
                </Grid>
                {nationSelected && <Grid item xs={6} md={9}>
                  <QueryStage steps={getStages()} setStageSelected={selectedStage} />
                </Grid>}
              </Grid>
              }
              {queryData && <Grid item xs={12} md={8} lg={9}>
                <DataTable
                  dataKey="id"
                  value={queryData}
                  stripedRows
                  paginator rows={5}
                  size='small'
                  className='query-table'
                  emptyMessage="No Data found."
                >
                  {columns[stageSchema].map((col, i) => (
                    <Column
                      className='dashboard-column'
                      key={col.field}
                      field={col.field}
                      header={col.header}
                      nestedCol={col.nestedCol}
                      body={(rowData) => renderColumnContent(rowData, col)}
                    />
                  ))}
                </DataTable>
              </Grid>}
            </Paper>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Tasks;
