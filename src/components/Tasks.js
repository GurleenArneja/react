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
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';

import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import QueryStage from './QueryStage';
import { useNavigate } from 'react-router-dom';
import { setFilterTextField } from '../features/tpchSlice';

const Tasks = () => {
  const dispatch = useDispatch();
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
  const [filters, setFilters] = useState({});
  const [filterText, setFilterText] = useState('');

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

  const initialFilterText = () => {
    let updatedColumns = JSON.parse(JSON.stringify(columns[stageSchema]));
    updatedColumns.map(column => {
      column.filterText = '';
      return column;
    });
    dispatch(setFilterTextField({ updatedColumns: updatedColumns, tableSelected: stageSchema }));
  };

  const initialiseFilters = (schema) => {
    const selectedColumns = columns[schema];
    const columnFields = selectedColumns.map(column => {
      if (column.nestedCol)
        return column.nestedCol + '.' + column.field;
      return column.field
    });
    setFilters(() => {
      const initialFilters = {};

      columnFields.forEach(field => {
        initialFilters[field] = { value: null, matchMode: FilterMatchMode.CONTAINS };
      });

      return initialFilters;
    });
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
          const schema = tasks[querySelected].stageSchema[stageSelected];
          setStageSchema(schema);

          if (schema === 'Orders') {
            const neworder = response.data.map(order => {
              order.lineitems['noOfLineItems'] = order.lineitems.length;
              return order;
            });
            setQueryData(neworder);
          }
          else if (schema === 'Lineitems') {
            const lineitemData = getLineItems(response.data);
            setQueryData(lineitemData);
          }
          else {
            setQueryData(response.data);
          }
          initialiseFilters(schema);
          initialFilterText();
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

  function onChange(e, index) {
    setFilterText(e.target.value);
    const updatedColumns = [...columns[stageSchema]];
    updatedColumns[index] = {
      ...updatedColumns[index],
      filterText: e.target.value,
    };
    dispatch(setFilterTextField({ updatedColumns: updatedColumns, tableSelected: stageSchema }));
  }
  function onKeyDown(e, col) {
    if (e.key === 'Enter') {
      let _filters = { ...filters };
      const filterField = col.nestedCol ? col.nestedCol + '.' + col.field : col.field;
      _filters[filterField].value = filterText === "" ? null : filterText;
      setFilters(() => _filters);
    }
  }

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
                  paginator rows={4}
                  filters={filters}
                  filterDisplay="row"
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
                      filter
                      sortable
                      filterElement={<InputText name="filterField" value={col.filterText} onChange={(e) => onChange(e, i)} onKeyDown={(e) => onKeyDown(e, col)} />}
                      showFilterMenu={false}
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
