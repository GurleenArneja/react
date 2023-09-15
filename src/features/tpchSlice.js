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
            {field: 'order_key', header: 'Order Key'},
            {field: 'customer_key', header: 'Customer Key', nestedCol: 'customer_info'},
            {field: '', header: 'Line Items', nestedCol: 'lineitems'},
            {field: 'orderstatus', header: 'Order Status'},
            {field: 'totalprice', header: 'Total Price'},
            {field: 'orderdate', header: 'Order Date'},
            {field: 'orderpriority', header: 'Order Priority'},
            {field: 'clerk', header: 'Clerk'},
            {field: 'shippriority', header: 'Ship Priority'},
            {field: 'comment', header: 'Comment'}
        ],
        Customer: [
            {field: 'customer_key', header: 'Customer Key'},
            {field: 'customer_name', header: 'Name'},
            {field: 'customer_address', header: 'Address'},
            {field: 'nation_key', header: 'Nation Key', nestedCol: 'nation'},
            {field: 'customer_phone', header: 'Phone'},
            {field: 'customer_acctbal', header: 'Acctbal'},
            {field: 'customer_mktsegment', header: 'Mktsegment'},
            {field: 'customer_comment', header: 'Comment'}
        ],
        Nation: [
            {field: 'nation_key', header: 'Nation Key'},
            {field: 'nation_name', header: 'Name'},
            {field: 'region_key', header: 'Region Key', nestedCol: 'region'},
            {field: 'nation_comment', header: 'Comment'}
        ],
        Region: [
            {field: 'region_key', header: 'Region Key'},
            {field: 'region_name', header: 'Name'},
            {field: 'region_comment', header: 'Region Comment'}
        ],
        Lineitems: [
            {field: 'order_key', header: 'Order Key'},
            {field: 'part_key', header: 'Part Key', nestedCol: 'partsupp'},
            {field: 'supplier_key', header: 'Supplier Key', nestedCol: 'partsupp'},
            {field: 'linenumber', header: 'Line Number'},
            {field: 'quantity', header: 'Quantity'},
            {field: 'extendedprice', header: 'Extended Price'},
            {field: 'discount', header: 'Discount'},
            {field: 'tax', header: 'Tax'},
            {field: 'returnflag', header: 'Return Flag'},
            {field: 'linestatus', header: 'Line Status'},
            {field: 'shipdate', header: 'Ship Date'},
            {field: 'commitdate', header: 'Commit Date'},
            {field: 'receiptdate', header: 'Receipt Date'},
            {field: 'shipinstruct', header: 'Ship Instruction'},
            {field: 'shipmode', header: 'Ship Mode'},
            {field: 'comment', header: 'Comment'}
        ],
        Partsupp: [
            {field: 'part_key', header: 'Part Key'},
            {field: 'supplier_key', header: 'Supplier Key', nestedCol: 'supplier_info'},
            {field: 'avail_qty', header: 'Available Qty'},
            {field: 'supply_cost', header: 'Supply Cost'},
            {field: 'comment', header: 'Comment'}
        ],
        Part: [
            {field: 'part_key', header: 'Part Key'},
            {field: 'part_name', header: 'Name'},
            {field: 'part_mfgr', header: 'MFGR'},
            {field: 'part_brand', header: 'Brand'},
            {field: 'part_type', header: 'Type'},
            {field: 'part_size', header: 'Size'},
            {field: 'part_container', header: 'Container'},
            {field: 'part_retailprice', header: 'Retail Price'},
            {field: 'part_comment', header: 'Comment'}
        ],
        Supplier: [
            {field: 'supplier_key', header: 'Supplier Key'},
            {field: 'supplier_name', header: 'Name'},
            {field: 'supplier_address', header: 'Address'},
            {field: 'nation_key', header: 'Nation Key', nestedCol: 'nation'},
            {field: 'supplier_phone', header: 'Phone'},
            {field: 'supplier_acctbal', header: 'Account Bal'},
            {field: 'supplier_comment', header: 'Comment'}
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
        }
    }
});

export const { setTableSelected, setSelectedCellData, clearSelectedCellData } = tpchSlice.actions;
export default tpchSlice.reducer;

