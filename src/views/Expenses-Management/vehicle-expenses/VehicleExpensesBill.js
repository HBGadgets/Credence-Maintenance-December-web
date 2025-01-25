import React, { useState,useEffect } from 'react';
import ExpenseForm from './VehicleExpenseForm';
import ExpenseList from './VehicleExpenseTable';
import { Modal, Button, Box, Typography, TextField, InputAdornment} from '@mui/material';
import { CFormInput, CInputGroup, CInputGroupText } from '@coreui/react';
import { cilSearch } from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
// import axios from 'axios';
import { FaSearch } from "react-icons/fa";
import { Search } from "@mui/icons-material";
import fileData from "./data"

const VehicleExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [filteredExpenses, setFilteredExpenses] = useState([])
    const [searchTerm, setSearchTerm] =useState("")

    const handleExpensesUpdate = (updatedExpenses) => {
        setExpenses(updatedExpenses);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                // const response = await axios.get('http://localhost:5000/expenses');
                // console.log("fetch data to show in vehicle expenses table",response.data);
                // //   // Fetch all expenses (no vehicleId needed)
                // //onExpensesUpdate(response.data);
                // setExpenses(response.data)
                // setFilteredExpenses(response.data)

                // here we will use dummy data
                setExpenses(fileData)
                setFilteredExpenses(fileData)

            } catch (error) {
                alert('Error fetching expenses: ' + error.message);
            }
        };

        fetchExpenses();  // Call fetch function to get all expenses
    }, []); 
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
    //   const filteredLrs = allLrs.filter((lr) => lr.name.toLowerCase().includes(term
    //     ));
        if (!term) {
            setFilteredExpenses(expenses);
        } else {
          const filtered = expenses.filter((vehicle) => {
            return (
              ( vehicle.vehicleName && vehicle.vehicleName.toLowerCase().includes(term)) ||
              (vehicle.category && vehicle.category.toLowerCase().includes(term)) ||
              (vehicle.amount && vehicle.amount.toString().includes(term)) ||
              (vehicle.vendor && vehicle.vendor.toString().includes(term)) 

              
            );
          });
          console.log("this are filtered records",filtered);
          
          setFilteredExpenses(filtered);
        }
      };

    return (
        <div>
            <header style={{display:'flex',justifyContent:'space-between'}}>
                <Typography variant="h4" component="h1" gutterBottom style={{fontFamily:'cursive'}}>
                    {/* Vehicle Expenses */}
                </Typography>
                <div style={{display:'flex', gap:'0.5rem'}}>

                <CInputGroup className=" ">
                  <CInputGroupText>
                    <CIcon icon={cilSearch} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    placeholder="Search here..."
                    value={searchTerm}
                    onChange={handleSearch }
                  />
                </CInputGroup>

        <Button variant="contained"  onClick={handleOpenModal} style={{ color:'white', background:'orange', width:'12rem'}}>
                    Add Expense
        </Button>
      </div>
                
                
            </header>

            <div>
                <ExpenseList expenses={expenses} filteredExpenses={filteredExpenses} setFilteredExpenses={setFilteredExpenses} onExpensesUpdate={handleExpensesUpdate} />
            </div>

            
            <ExpenseForm onExpensesUpdate={handleExpensesUpdate} openModal={openModal} handleCloseModal={handleCloseModal} />
            
        </div>
    );
};

export default VehicleExpenses;