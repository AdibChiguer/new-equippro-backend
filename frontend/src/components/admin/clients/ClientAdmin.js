import React, {useState} from 'react'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Button } from "@chakra-ui/react";

import DATA from './data'
import './clientAdmin.css'
import Filters from './Filters';

const columns = [
  {
    accessorKey: "cin",
    header: "Cin",
    cell: (props) => <p>{props.getValue()}</p>
  },
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: (props) => <p>{props.getValue()}</p>
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: (props) => <p>{props.getValue()}</p>
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (props) => <p>{props.getValue()}</p>
  },
]


const ClientAdmin = () => {
  const [data, setData] = useState(DATA);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
    meta: {
      updateData: (rowIndex, columnId, value) =>
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? {
                  ...prev[rowIndex],
                  [columnId]: value,
                }
              : row
          )
        ),
    },
  });


  return (
    <div className='equipment-content-container'>
      <div className='equipment-table-header'>
        <span>Clients</span>
        <Filters 
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
        <button className='comic-button'>
          Create
        </button>
      </div>
      <div className='equipment-table-container'>
        <table className='table'>
          <thead>
            <tr>
              {table.getHeaderGroups().map((headerGroup) => {
                return headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id}>
                      {header.column.columnDef.header}
                    </th>
                  );
                });
              })}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='pagination-div'>
        <Button
          onClick={() => table.previousPage()}
          isDisabled={!table.getCanPreviousPage()}
        ><NavigateBeforeIcon/></Button>
        <div className='pagination-info'>
          <span>{table.getState().pagination.pageIndex + 1}</span>
          <span>/</span>
          <span>{table.getPageCount()}</span>
        </div>
        <Button
          onClick={() => table.nextPage()}
          isDisabled={!table.getCanNextPage()}
        ><NavigateNextIcon/></Button>
      </div>
    </div>
  )
}

export default ClientAdmin