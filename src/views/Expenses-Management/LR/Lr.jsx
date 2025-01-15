import React, { useEffect, useState } from 'react';
import LRForm from './LRFormCoreUi';
import LRFormEdit from './LrFormEdit';
//import Actions from './Actions';
import LRTable from './LrTable';
// import EditAction from './EditAction';
// import DeleteAction from './DeleteAction';
// import PrintAction from './PrintAction';
import fileData from './data'
// import axios from 'axios';
import { Typography,Button, Box, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';


const LR = () => {
  const [formData, setFormData] = useState([]);
  const [allLrs, setAllLrs] = useState([]); // All invoices
  const [filteredLrs, setFilteredLrs] = useState([]); // Filtered invoices for display
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentLr, setCurrentLr] = useState(null); // For editing
  
  // Close both modals
  const handleModalClose = () => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setCurrentInvoice(null); // Clear the current invoice
  };
  const handleAddModalClose = () => {
    setAddModalOpen(false);
  }
  const handleCreateLR = () => {
    setAddModalOpen(true);
  };

  const handleSaveLR = (data) => {
    setFormData([...formData, data]);
    setShowModal(false);
  };
  const fetchLrs = async () => {
    try {
      // const response = await axios.get('http://localhost:5000/lrs'); // Adjust endpoint as needed
      // setAllLrs(response.data);
      // setFilteredLrs(response.data); 
      //dummy data
      setAllLrs(fileData)
      setFilteredLrs(fileData)
    } catch (err) {
      console.error('Error fetching LRs:', err);
      alert('Error fetching LRs');
    }
  };

  useEffect(()=>{
    fetchLrs();
  },[])

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
//   const filteredLrs = allLrs.filter((lr) => lr.name.toLowerCase().includes(term
//     ));
    if (!term) {
        setFilteredLrs(allLrs);
    } else {
      const filtered = allLrs.filter((lr) => {
        return (
          (lr.lrNumber && lr.lrNumber.toLowerCase().includes(term)) ||
          (lr.owner && lr.owner.toLowerCase().includes(term)) ||
          (lr.consignorName && lr.consignorName.toLowerCase().includes(term)) ||
          (lr.consigneeName && lr.consigneeName.toLowerCase().includes(term)) ||
          (lr.customer && lr.customer.toLowerCase().includes(term)) ||
          (lr.from && lr.from.toLowerCase().includes(term)) ||
          (lr.to && lr.to.toLowerCase().includes(term)) ||
          (lr.vehicleNumber && lr.vehicleNumber.toLowerCase().includes(term))
        );
      });
      console.log("this are filtered records",filtered);
      
      setFilteredLrs(filtered);
    }
  };
  return (
    <div>
      {/* Header */}
     
      <header style={{display:'flex',justifyContent:'space-between'}}>
                <Typography variant="h4" component="h1" gutterBottom>
                     
                </Typography>
                <div style={{display:'flex'}}>
        
        <TextField
      id="search"
      placeholder="Search here"
      value={searchTerm}
      onChange={handleSearch}
      variant="outlined"
      size="small"
      sx={{
        width: "300px",
        
        marginRight: "1rem",
        "& .MuiOutlinedInput-root": {
          borderRadius: "6px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          background: "white",
          
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
    />
        <Button variant="contained"   onClick={handleCreateLR} style={{height: "40px", color:'white', background:'black'}}>
                    Create LR
        </Button>
      </div>
                
                
            </header>
      

      {/* Table */}
      <LRTable filteredLrs={filteredLrs}  sx={{padding:'0'}}/>

      
       
            <LRForm onSave={handleSaveLR} handleAddModalClose={handleAddModalClose} addModalOpen={addModalOpen} setAddModalOpen={setAddModalOpen}/>
        <LRFormEdit />
        {/* for delete and view and print */}
        {/* <Actions />  */}
      
    </div>
  );
};

export default LR;
