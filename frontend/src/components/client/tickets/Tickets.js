import React, {useState , useEffect} from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Filters from './Filters';
import { Button } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useJwt } from 'react-jwt';

const columns = [
  {
    accessorKey: "ticketId",
    header: "Id",
    cell: (props) => <p>{props.getValue()}</p>
  },
  {
    accessorKey: "equipmentReference",
    header: "Equipment Reference",
    cell: (props) => <p>{props.getValue()}</p>
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: (props) => <p>{props.getValue()}</p>
  },
  {
    accessorKey: "technician",
    header: "Technician",
    cell: (props) => <p>{props.getValue()}</p>
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (props) => <p>{props.getValue()}</p>
  },
];

const Tickets = () => {
  const [data, setData] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { decodedToken, isExpired } = useJwt(token);

  useEffect(() => {
    if(decodedToken){
      getAllTickets()
    }
  }, [decodedToken]);

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

  function getAllTickets() {
    axios.get(`http://localhost:8080/tickets/equipment-owner-tickets/${decodedToken.sub}` , {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        const formattedData = res.data.map(ticket => ({
          ticketId: ticket.id,
          equipmentReference: ticket.equipment.ref,
          owner: ticket.equipment.owner.cin,
          technician: ticket.technician.cin,
          status: ticket.status,
        }));
        setData(formattedData);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'something went wrong. try again',
        })
      })
  }

  return (
    <div className='equipment-content-container'>
      <div className='equipment-table-header'>
        <span>Tickets</span>
        <Filters 
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
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
              <tr key={row.id} onClick={() => navigate(`/client/ticket-details/${row.original.ticketId}`)}>
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

export default Tickets