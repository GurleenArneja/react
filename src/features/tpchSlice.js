import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tables: [
        'Orders',
        'Customer',
        'Nation',
        'Region',
        'Lineitems',
        'Partsupp',
        'Part',
        'Supplier'
    ],
    tableSelected: "Orders",
    selectedCellData: [],
    columns: {
        Orders: [
            {field: 'order_key', header: 'Order Key', filterText: ''},
            {field: 'customer_key', header: 'Customer Key', nestedCol: 'customer_info', filterText: ''},
            {field: 'lineitems', header: 'Line Items', nestedCol: 'lineitems', filterText: ''},
            {field: 'orderstatus', header: 'Order Status', filterText: ''},
            {field: 'totalprice', header: 'Total Price', filterText: ''},
            {field: 'orderdate', header: 'Order Date', filterText: ''},
            {field: 'orderpriority', header: 'Order Priority', filterText: ''},
            {field: 'clerk', header: 'Clerk', filterText: ''},
            {field: 'shippriority', header: 'Ship Priority', filterText: ''},
            {field: 'comment', header: 'Comment', filterText: ''}
        ],
        Customer: [
            {field: 'customer_key', header: 'Customer Key', filterText: ''},
            {field: 'customer_name', header: 'Name', filterText: ''},
            {field: 'customer_address', header: 'Address', filterText: ''},
            {field: 'nation_key', header: 'Nation Key', nestedCol: 'nation', filterText: ''},
            {field: 'customer_phone', header: 'Phone', filterText: ''},
            {field: 'customer_acctbal', header: 'Acctbal', filterText: ''},
            {field: 'customer_mktsegment', header: 'Mktsegment', filterText: ''},
            {field: 'customer_comment', header: 'Comment', filterText: ''}
        ],
        Nation: [
            {field: 'nation_key', header: 'Nation Key', filterText: ''},
            {field: 'nation_name', header: 'Name', filterText: ''},
            {field: 'region_key', header: 'Region Key', nestedCol: 'region', filterText: ''},
            {field: 'nation_comment', header: 'Comment', filterText: ''}
        ],
        Region: [
            {field: 'region_key', header: 'Region Key', filterText: ''},
            {field: 'region_name', header: 'Name', filterText: ''},
            {field: 'region_comment', header: 'Region Comment', filterText: ''}
        ],
        Lineitems: [
            {field: 'order_key', header: 'Order Key', filterText: ''},
            {field: 'part_key', header: 'Part Key', nestedCol: 'partsupp', filterText: ''},
            {field: 'supplier_key', header: 'Supplier Key', nestedCol: 'partsupp', filterText: ''},
            {field: 'linenumber', header: 'Line Number', filterText: ''},
            {field: 'quantity', header: 'Quantity', filterText: ''},
            {field: 'extendedprice', header: 'Extended Price', filterText: ''},
            {field: 'discount', header: 'Discount', filterText: ''},
            {field: 'tax', header: 'Tax', filterText: ''},
            {field: 'returnflag', header: 'Return Flag', filterText: ''},
            {field: 'linestatus', header: 'Line Status', filterText: ''},
            {field: 'shipdate', header: 'Ship Date', filterText: ''},
            {field: 'commitdate', header: 'Commit Date', filterText: ''},
            {field: 'receiptdate', header: 'Receipt Date', filterText: ''},
            {field: 'shipinstruct', header: 'Ship Instruction', filterText: ''},
            {field: 'shipmode', header: 'Ship Mode', filterText: ''},
            {field: 'comment', header: 'Comment', filterText: ''}
        ],
        Partsupp: [
            {field: 'part_key', header: 'Part Key', filterText: ''},
            {field: 'supplier_key', header: 'Supplier Key', nestedCol: 'supplier_info', filterText: ''},
            {field: 'avail_qty', header: 'Available Qty', filterText: ''},
            {field: 'supply_cost', header: 'Supply Cost', filterText: ''},
            {field: 'comment', header: 'Comment', filterText: ''}
        ],
        Part: [
            {field: 'part_key', header: 'Part Key', filterText: ''},
            {field: 'part_name', header: 'Name', filterText: ''},
            {field: 'part_mfgr', header: 'MFGR', filterText: ''},
            {field: 'part_brand', header: 'Brand', filterText: ''},
            {field: 'part_type', header: 'Type', filterText: ''},
            {field: 'part_size', header: 'Size', filterText: ''},
            {field: 'part_container', header: 'Container', filterText: ''},
            {field: 'part_retailprice', header: 'Retail Price', filterText: ''},
            {field: 'part_comment', header: 'Comment', filterText: ''}
        ],
        Supplier: [
            {field: 'supplier_key', header: 'Supplier Key', filterText: ''},
            {field: 'supplier_name', header: 'Name', filterText: ''},
            {field: 'supplier_address', header: 'Address', filterText: ''},
            {field: 'nation_key', header: 'Nation Key', nestedCol: 'nation', filterText: ''},
            {field: 'supplier_phone', header: 'Phone', filterText: ''},
            {field: 'supplier_acctbal', header: 'Account Bal', filterText: ''},
            {field: 'supplier_comment', header: 'Comment', filterText: ''}
        ],
        Q21: [
            {field: '_id', header: 'ID'},
            {field: 'numwait', header: 'Waiting Orders'}
        ]
    }
};

const tpchSlice = createSlice({
    name: 'tpch',
    initialState: initialState,
    reducers: {
        setTableSelected: (state, action) => {
            state.tableSelected = action.payload;
        },
        setSelectedCellData: (state, action) => {
            if(Array.isArray(action.payload)) {
                state.selectedCellData = [...action.payload];
            } else {
                state.selectedCellData = [action.payload];
            }
        },
        clearSelectedCellData: (state) => {
            state.selectedCellData = [];
        },
        setFilterTextField: (state, action) => {
            state.columns[state.tableSelected] = action.payload;
        }
    }
});

export const { 
    setTableSelected, 
    setSelectedCellData, 
    clearSelectedCellData, 
    setFilterTextField 
} = tpchSlice.actions;
export default tpchSlice.reducer;

