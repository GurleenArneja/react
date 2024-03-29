import React, { useEffect, useMemo, useState } from 'react';
import HeaderLinks from './HeaderLinks';
import axios from 'axios';
import {
  Box,
  Container,
  Grid,
  Toolbar
} from "@mui/material";
import Table from './Table';
import RecentQueries from './RecentQueries';
import { useSelector, useDispatch } from 'react-redux';
import { setTableSelected, setSelectedCellData } from '../features/tpchSlice';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tableSelected, selectedCellData } = useSelector((state) => state.tpch);
  const { userLoggedIn } = useSelector((state) => state.auth);
  const [loadTable, setLoadTable] = useState(false);

  const { orders } = useSelector((state) => state.orders);

  const [recentQueries, setRecentQueries] = useState();
  const [selectedQueryData, setSelectedQueryData] = useState(null);

  useEffect(() => {
    getRecentQueries();
  },[]);

  const getRecentQueries = () => {
    const url = `http://localhost:8000/get-queries?user_name=${userLoggedIn}`;

    axios.get(url)
      .then((response) => {
        setRecentQueries(response.data.queries);
        setLoadTable(true);
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle errors here
      });
  }

  const getUniqueObjects = (originalArray, key) => {
    const uniqueKeys = new Set();
    const uniqueArray = [];

    originalArray.forEach(obj => {
      if (!uniqueKeys.has(obj[key])) {
        uniqueKeys.add(obj[key]);
        uniqueArray.push(obj);
      }
    });
    return uniqueArray;
  };

  const tableData = useMemo(() => {
    const getTableData = () => {
        switch(tableSelected) {
            case 'Orders':
                const orderData = orders.map(order => {
                  const neworder = JSON.parse(JSON.stringify(order));
                  neworder.lineitems['noOfLineItems'] = neworder.lineitems.length;
                  return neworder;
                });
                return orderData;
            case 'Customer': 
                const customerData = orders.map(order => order.customer_info);
                return customerData;
            case 'Nation':
                const combinedNationObjects = orders.flatMap(order => [
                    order.customer_info.nation,
                    order.lineitems.flatMap((lineitem) => [
                        lineitem.partsupp.supplier_info.nation
                    ])
                ]);
                const flatNationArray = combinedNationObjects.flat(Infinity);
                const uniqueNations = getUniqueObjects(flatNationArray, 'nation_key');
                return uniqueNations;
            case 'Region':
                const combinedRegionObjects = orders.flatMap(order => [
                  order.customer_info.nation.region,
                  order.lineitems.flatMap((lineitem) => [
                      lineitem.partsupp.supplier_info.nation.region
                  ])
                ]);
                const flatRegionArray = combinedRegionObjects.flat(Infinity);
                const uniqueRegions = getUniqueObjects(flatRegionArray, 'region_key');
                return uniqueRegions;
            case 'Lineitem':
                const lineitemData = orders.map(order => order.lineitems);
                const flatLineitemData = lineitemData.flat(Infinity);
                return flatLineitemData;
            case 'Partsupp':
                const combinedPartsuppObjects = orders.flatMap(order => [
                  order.lineitems.flatMap((lineitem) => [
                      lineitem.partsupp
                  ])
                ]);
                const flatPartsuppData = combinedPartsuppObjects.flat(Infinity);
                return flatPartsuppData;
            case 'Part':
                const combinedPartObjects = orders.flatMap(order => [
                  order.lineitems.flatMap((lineitem) => [
                      lineitem.partsupp.part
                  ])
                ]);
                const flatPartData = combinedPartObjects.flat(Infinity);
                const uniqueParts = getUniqueObjects(flatPartData, 'part_key');
                return uniqueParts;
            case 'Supplier':
                const combinedSupplierObjects = orders.flatMap(order => [
                  order.lineitems.flatMap((lineitem) => [
                      lineitem.partsupp.supplier_info
                  ])
                ]);
                const flatSupplierData = combinedSupplierObjects.flat(Infinity);
                const uniqueSuppliers = getUniqueObjects(flatSupplierData, 'supplier_key');
                return uniqueSuppliers;
        }
    };

    return selectedCellData.length ? selectedCellData : getTableData();
  }, [orders, tableSelected]);

  const openSelectedCell = (data) => {
    const tableValue = data.columnSelected;
    const newTableValue = tableValue.charAt(0).toUpperCase() + tableValue.replace(/_info$/, '').slice(1);
    dispatch(setTableSelected(newTableValue));
    dispatch(setSelectedCellData(data.tableData));
  };

  const setRecentActions = (data) => {
    if(data && data.length) {
      setRecentQueries(data);
    }
  }

  const selectedQuery = (query) => {
    dispatch(setTableSelected(query.table));
    setSelectedQueryData(query);
  }

  useEffect(() => {
    //tableData
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [loadTable, tableData]);

  return (
    <>
      <HeaderLinks header="Dashboard"/>
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
          <Grid container spacing={3}>
            {/* Tables */}
            {loadTable ? <Table tableSelected={tableSelected} 
              tableData={tableData} 
              setSelectedCol={openSelectedCell}
              setRecentActions={setRecentActions}
              selectedQueryData={selectedQueryData}
              recentQueries={recentQueries}/> : <span>Loading...</span>}
            {/* Recent Queries */}
            <RecentQueries recentQueries={recentQueries} selectedQuery={selectedQuery}/>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
