import React, { useEffect, useState } from 'react';

import {
    Grid,
    Paper,
} from "@mui/material";
import { FaSearch } from 'react-icons/fa';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';

import { useSelector } from "react-redux";

const Table = ({tableSelected, tableData}) => {
    const [filters, setFilters] = useState({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [columnFields, setColumnFields] = useState([]);

    const [selectedCell, setSelectedCell] = useState(null);
    const isCellSelectable = (event) => (event?.data?.column?.props?.nestedCol ? true : false);

    const { columns } = useSelector((state) => state.tpch);

    const openSelectedCell = (value) => {
        const columnSelected = value?.column?.props?.nestedCol;
        setSelectedCell(value.rowIndex);
        console.log(columnSelected, value?.rowData[columnSelected], value);
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <FaSearch />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const renderColumnContent = (rowData, column) => {
        const {field, nestedCol} = column;
        if ( rowData ) {
            if (nestedCol) {
                if (!field) {
                    // only for orders to calculate number of line items
                    return (
                        <span style={{ color: '#3F51B5'}}>
                            {rowData[nestedCol].length}
                        </span>
                    );
                }
                return ( 
                    <span style={{ color: '#3F51B5'}}>
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
            return selectedColumns.map(column => column.field);
        });
    },[tableSelected])

    useEffect(() => {
        setFilters(() => {
            const initialFilters = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS }
            };
        
            columnFields.forEach(field => {
                initialFilters[field] = { value: null, matchMode: FilterMatchMode.CONTAINS };
            });
        
            return initialFilters;
        })
    }, [columnFields]);

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
                paginator rows={8}
                size='small'
                filters={filters}
                filterDisplay="row"
                globalFilterFields={columnFields}
                cellSelection 
                selectionMode="single" 
                selection={selectedCell}
                onSelectionChange={(e) => openSelectedCell(e.value)}
                isDataSelectable={isCellSelectable}
                header={header}
                className='dashboard-table'
                tableStyle={{ minWidth: '50rem' }}
                emptyMessage="No Data found."
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
                        showFilterMenu={false}
                    />
                ))}
            </DataTable>
            </Paper>
        </Grid>
    );
};

export default Table;
