import React from "react";
import { CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell } from '@coreui/react';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { FaPrint } from 'react-icons/fa';
import { IconButton, TableContainer } from '@mui/material';
import { MdOutlinePreview } from "react-icons/md";


const ExpenseList = ({ expenses, onExpensesUpdate, filteredExpenses, setFilteredExpenses }) => {
  const columns = [
    { label: 'Vehicle', key: 'vehicleName' },
    { label: 'Category', key: 'category' },
    { label: 'Amount', key: 'amount' },
    { label: 'Vendor', key: 'vendor' },
    { label: 'Date', key: 'date' }
  ];

  const handleDelete = async (expenseId) => {
    console.log("id for deletion",expenseId);
    
    const confirmDelete = window.confirm('Are you sure you want to delete this expense?');

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFilteredExpenses((prevExpenses) =>
          prevExpenses.filter((expense) => expense._id !== expenseId)
        );
        alert('Expense deleted successfully');
      } else {
        alert('Failed to delete expense');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Error deleting expense');
    }
  };

  return (
    <TableContainer style={{border:'1px solid black', borderRadius:'10px'}}>
      <CTable hover responsive striped>
        <CTableHead>
          <CTableRow>
            {columns.map((column) => (
              <CTableHeaderCell key={column.key}>{column.label}</CTableHeaderCell>
            ))}
            <CTableHeaderCell style={{ paddingLeft: '6rem' }}>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredExpenses.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan={columns.length + 1} style={{ textAlign: 'center' }}>
                No expenses recorded.
              </CTableDataCell>
            </CTableRow>
          ) : (
            filteredExpenses.map((expense) => (
              <CTableRow key={expense._id}>
                {columns.map((column) => (
                  <CTableDataCell key={column.key}>
                    {column.key === 'date'
                      ? new Date(expense[column.key]).toLocaleDateString()
                      : expense[column.key]}
                  </CTableDataCell>
                ))}
                <CTableDataCell className="text-center" style={{ display: 'flex', justifyContent: 'center' }}>
                  <IconButton
                    aria-label="view"
                    onClick={() => console.log('View:', expense)}
                    style={{ margin: '0 5px', color: 'lightBlue' }}
                  >
                    <MdOutlinePreview />
                  </IconButton>
                  <IconButton
                    aria-label="edit"
                    onClick={() => console.log('Edit:', expense)}
                    style={{ margin: '0 5px', color: 'orange' }}
                  >
                    <AiFillEdit style={{ fontSize: '20px' }} />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(expense._id)}
                    style={{ margin: '0 5px', color: 'red' }}
                  >
                    <AiFillDelete style={{ fontSize: '20px' }} />
                  </IconButton>
                  <IconButton
                    aria-label="print"
                    onClick={() => console.log('Print:', expense)}
                    style={{ margin: '0 5px', color: 'green' }}
                  >
                    <FaPrint style={{ fontSize: '20px' }} />
                  </IconButton>
                </CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
      </TableContainer>
  );
};

export default ExpenseList;
