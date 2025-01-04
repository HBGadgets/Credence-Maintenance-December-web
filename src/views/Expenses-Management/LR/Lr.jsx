import React, { useEffect, useState } from 'react';
import LRForm from './LrForm';
import LRFormEdit from './LrFormEdit';
//import Actions from './Actions';
import LRTable from './LrTable';
// import EditAction from './EditAction';
// import DeleteAction from './DeleteAction';
// import PrintAction from './PrintAction';
import axios from 'axios';
import { Typography,Button, Box } from '@mui/material';

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
      const response = await axios.get('http://localhost:5000/lrs'); // Adjust endpoint as needed
      setAllLrs(response.data);
      setFilteredLrs(response.data); // Initialize filtered invoices with all invoices
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
          (lr.to && lr.to.toLowerCase().includes(term))
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
                    Lorry Receipt - Challan
                </Typography>
                <div style={{display:'flex'}}>
        <input
          type="text"
          id="search"
          placeholder="Search here"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            width: "300px",
            padding: "10px",
            fontSize: "16px",
            border: "none",
            borderRadius: "6px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            marginRight: "10px",
            height: "40px",
            outline: "none",
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
