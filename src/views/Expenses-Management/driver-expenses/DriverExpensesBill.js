import React, { useState, useEffect } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CContainer, CFormInput, CRow, CCol, CInputGroup, CInputGroupText } from '@coreui/react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import DriverExpenseList from './DriverExpenseList';
import DriverExpenseForm from './DriverExpenseForm';
import axios from 'axios';
import { cilSearch } from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';

const DriverExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/driverExpense`);
      const data = Array.isArray(response.data) ? response.data : [];
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses', error);
      setExpenses([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const searchTerm = search || '';  // Ensure search is never undefined or null
    return (
      expense.expenseType && expense.expenseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.expenseDate && expense.expenseDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.amount && expense.amount.toString().includes(searchTerm) ||
      expense.description && expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const toggleModal = () => {
    setModal(!modal);
  };
  const openModal = () => {
    setModal(true)
  };
  const closeModal = () => {
    setModal(false)
    setSelectedExpense(null);
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setModal(true);
  };

  return (
    <div>
       <header style={{display:'flex', justifyContent:'space-between'}}>
          <h1> </h1>
          <div style={{display:'flex', gap:'0.5rem'}}>
            <CInputGroup className=" ">
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <CFormInput
                type="text"
                placeholder="Search here..."
                value={search} onChange={handleSearchChange}
              />
            </CInputGroup>
            <CButton variant="contained"   onClick={toggleModal} style={{ background:'orange', color:'white', width:'10rem'}}>
              Add Expense
            </CButton>
          </div>
        </header>
      <CCard className='mt-3'>
        <CCardHeader>
          <CRow className="align-items-center">
            <CCol md={6}>
              <h5>Driver Expenses</h5>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <DriverExpenseList expenses={expenses} filteredExpenses={filteredExpenses} search={search} onEdit={handleEdit} onRefresh={fetchExpenses} />
        </CCardBody>
      </CCard>
      <DriverExpenseForm
        modal={modal}
        toggleModal={toggleModal}
        openModal={openModal}
        closeModal={closeModal}
        selectedExpense={selectedExpense}
        onRefresh={fetchExpenses}
      />
    </div>
  );
};

export default DriverExpense;
