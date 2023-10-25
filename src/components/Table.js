import React, { useEffect, useState } from 'react';

import {
    Grid,
    Paper,
} from "@mui/material";
// import { FaSearch } from 'react-icons/fa';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';

import { InputText } from 'primereact/inputtext';

import { useSelector, useDispatch } from "react-redux";
import { setFilterTextField } from '../features/tpchSlice';
import { setUsersRecentAction } from '../features/authSlice';

const Table = ({tableSelected, tableData, setSelectedCol, setRecentActions, selectedQueryData, recentQueries}) => {
    const dispatch = useDispatch();

    const [filters, setFilters] = useState({});
    // const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filterText, setFilterText] = useState('');

    const [columnFields, setColumnFields] = useState([]);

    const [selectedCell, setSelectedCell] = useState(null);
    const isCellSelectable = (event) => (event?.data?.column?.props?.nestedCol ? true : false);

    const { columns } = useSelector((state) => state.tpch);

    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);

    const [queries, setQueries] = useState([]);

    useEffect(() => {
        //callback to pass data to dashboard
        setRecentActions(queries);
    },[queries]);

    const openSelectedCell = (value) => {
        const columnSelected = value?.column?.props?.nestedCol;
        const columnData = value?.rowData[columnSelected];
        setSelectedCell(value.rowIndex);
        const data = {
            columnSelected: columnSelected,
            tableData: columnData
        };
        setSelectedCol(data);
    }

    // const onGlobalFilterChange = (e) => {
    //     if (e.key === 'Enter') {
    //         let _filters = { ...filters };
    //         _filters['global'].value = globalFilterValue;
    //         setFilters(() => _filters);6
    //         setQueryData();
    //     }

    // };

    // const onInputChange = (e) => {
    //     setGlobalFilterValue(e.target.value);
    // }

    // const renderHeader = () => {
    //     return (
    //         <div className="flex justify-content-end">
    //             <span className="p-input-icon-left">
    //                 <FaSearch />
    //                 <InputText value={globalFilterValue} onChange={onInputChange} onKeyDown={onGlobalFilterChange} placeholder="Keyword Search" />
    //             </span>
    //         </div>
    //     );
    // };

    // const header = renderHeader();

    const renderColumnContent = (rowData, column) => {
        const {field, nestedCol} = column;
        if ( rowData ) {
            if (nestedCol) {
                return ( 
                    <span style={{ color: '#3F51B5', cursor:'pointer'}}>
                        {rowData[nestedCol][field]}
                    </span>
                );
            } else {
                return <span>{rowData[field]}</span>;
            }
        }
    };

    useEffect(() => {
        setColumnFields(() => {
            const selectedColumns = columns[tableSelected];
            return selectedColumns.map(column => {
                if (column.nestedCol)
                    return column.nestedCol + '.' + column.field;
                return column.field
            });
        });
    },[tableSelected])

    const initialiseFilters = () => {
        setFilters(() => {
            const initialFilters = {
                // global: { value: null, matchMode: FilterMatchMode.CONTAINS }
            };
        
            columnFields.forEach(field => {
                initialFilters[field] = { value: null, matchMode: FilterMatchMode.CONTAINS };
            });
        
            return initialFilters;
        })
    };

    const initialFilterText = () => {
        let updatedColumns = JSON.parse(JSON.stringify(columns[tableSelected]));
        updatedColumns.map(column => {
            column.filterText = '';
            return column;
          });
        dispatch(setFilterTextField({updatedColumns: updatedColumns, tableSelected: tableSelected}));
    };

    useEffect(() => {
        initialiseFilters();
        initialFilterText();
    }, [columnFields]);

    useEffect(() => {
        setSortField(null);
        setSortOrder(null);
        if (selectedQueryData) {
            setSortField(selectedQueryData.col);
            setSortOrder(selectedQueryData.order);
            setFilters(() => selectedQueryData.filters);
            let updatedColumns = JSON.parse(JSON.stringify(columns[tableSelected]));
            updatedColumns.map(column => {
                const field = column.nestedCol ? column.nestedCol + '.' + column.field : column.field;
                const filterValue = selectedQueryData.filters[field]?.value ? selectedQueryData.filters[field].value : "";
                column.filterText = filterValue
                return column;
              });
            dispatch(setFilterTextField({updatedColumns: updatedColumns, tableSelected: tableSelected}));
        }

    },[selectedQueryData])

    const onSort = (e) => {
        setSortField(() => e.sortField);
        setSortOrder(() => e.sortOrder);
        setQueryData(e.sortField, e.sortOrder, "Sort");
    }

    function onChange(e, index) {
        setFilterText(e.target.value);
        const updatedColumns = [...columns[tableSelected]];
        updatedColumns[index] = {
            ...updatedColumns[index],
            filterText: e.target.value,
        };
        dispatch(setFilterTextField({updatedColumns: updatedColumns, tableSelected: tableSelected}));
    }

    function checkIfFilterHasValue(obj) {
            for (const key in obj) {
                if (obj.hasOwnProperty(key) && obj[key] !== null && obj[key].value !== null) {
                    return true;
                }
            }
            return false;
    }
    
    function setQueryData(col, order, action) {
        if (checkIfFilterHasValue(filters) || action === 'Sort' || (sortField && sortOrder)) {
            const newQueries = [...queries, {
                table: tableSelected,
                col: col ? col : sortField,
                order: order ? order : sortOrder,
                filters: JSON.parse(JSON.stringify(filters)),
                time: new Date()
            }];
            setQueries(() => newQueries);
            dispatch(setUsersRecentAction(newQueries));

        }
    }

    function onKeyDown(e, col) {
       if (e.key === 'Enter') {
            let _filters = { ...filters };
            const filterField = col.nestedCol ? col.nestedCol + '.' + col.field : col.field;
            if (filterText === "") {
                _filters[filterField].value = null;
            } else {
                _filters[filterField].value = filterText;
            }
            setFilters(() => _filters);
            setQueryData();
       }
    }

    useEffect(() =>{
        console.log(columns[tableSelected]);
    },[columns]);

    useEffect(() => {
        if (recentQueries) {
            setQueries(recentQueries);
        }
    },[]);

    return (
        <Grid item xs={12} md={8} lg={9}>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 470,
                    padding: '2px'
                }}
            >
            <DataTable
                dataKey="id"
                value={tableData}
                stripedRows 
                paginator rows={9}
                size='small'
                filters={filters}
                filterDisplay="row"
                // globalFilterFields={columnFields}
                cellSelection 
                selectionMode="single" 
                selection={selectedCell}
                onSelectionChange={(e) => openSelectedCell(e.value)}
                isDataSelectable={isCellSelectable}
                // header={header}
                className='dashboard-table'
                tableStyle={{ minWidth: '50rem' }}
                emptyMessage="No Data found."
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={onSort}
            >
                {columns[tableSelected].map((col, i) => (
                    <Column 
                        className='dashboard-column'
                        key={col.field} 
                        field={col.field} 
                        header={col.header}
                        nestedCol={col.nestedCol}
                        body={(rowData) => renderColumnContent(rowData, col)}
                        sortable
                        filter
                        filterElement={<InputText name="filterField" value={col.filterText} onChange={(e) => onChange(e, i)} onKeyDown={(e) => onKeyDown(e, col)} />}
                        showFilterMenu={false}
                    />
                ))}
            </DataTable>
            </Paper>
        </Grid>
    );
};

export default Table;
