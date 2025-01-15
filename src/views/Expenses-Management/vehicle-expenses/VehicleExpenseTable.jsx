import React from "react";
import { CRow,CCol,CCard,CCardHeader, CCardBody,CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell } from '@coreui/react';
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
    <>

      <CRow style={{marginTop:'1rem'}}>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Vehicle Expenses</strong>
              {/* <CButton
                color="primary"
                className="float-end"
                onClick={() => setAddModalOpen(true)}
              >
                Add Driver
              </CButton> */}
            </CCardHeader>
            <CCardBody>
              {filteredExpenses.length === 0 ? (
                <p className="text-center">No  Vehicle Expenses available.</p>
              ) : (
                <CTable striped hover responsive bordered>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell className="text-center" scope="col">
                        SN
                      </CTableHeaderCell>
                      {/* {columns.map((column, index) => (
                        <CTableHeaderCell key={index} className="text-center" scope="col">
                          {column}
                        </CTableHeaderCell>
                      ))} */}
                      {columns.map((column) => (
              <CTableHeaderCell  className="text-center" key={column.key}>{column.label}</CTableHeaderCell>
            ))}
                      <CTableHeaderCell className="text-center" scope="col">
                        Actions
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {/* {data.map((driver, index) => (
                      <CTableRow key={driver.id}>
                        <CTableDataCell className="text-center">{index + 1}</CTableDataCell> 
                        <CTableDataCell className="text-center">{driver.name}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {driver.contactNumber}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{driver.email}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            color="primary"
                            size="sm"
                            onClick={() => handleViewClick(driver)}
                            className="text-center"
                          >
                            <Eye className="me-2" size={16} />
                            View Profile
                          </CButton>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            color="warning"
                            size="sm"
                            onClick={() => handleEditDriver(driver)}
                          >
                            <Edit size={16} /> 
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            className="ms-2"
                            onClick={() => handleDeleteDriver(driver.id)}
                          >
                            <Trash2 size={16} /> 
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))} */}
                    {
                      filteredExpenses.map((expense, index) => (
                        <CTableRow key={expense._id}>
                          <CTableDataCell className="text-center" >{index+1} </CTableDataCell>

                          {columns.map((column) => (
                            <CTableDataCell key={column.key} className="text-center text-nowrap">
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
                    }
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      </>
  );
};

export default ExpenseList;
