import React, { useState } from 'react';
import { Button, TextField, Typography, Modal, Box, InputAdornment } from '@mui/material';
import PurchaseForm from './PurchaseForm';
import PurchaseList from './PurchaseList';
import ViewPurchaseModal from './ViewPurchaseModal';
import EditPurchaseForm from './EditPurchaseForm';
import purchasesData from './data';
import { Search } from '@mui/icons-material';
import { CFormInput, CInputGroup, CInputGroupText } from '@coreui/react';
import { cilSearch } from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
const Purchase = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [purchases, setPurchases] = useState(purchasesData);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPurchase, setCurrentPurchase] = useState(null);
    const [filteredPurchases, setFilteredPurchases] = useState(purchases);

    // const handleSearchChange = (e) => {
    //     setSearchTerm(e.target.value);
    // };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
    //   const filteredLrs = allLrs.filter((lr) => lr.name.toLowerCase().includes(term
    //     ));
        if (!term) {
            setFilteredPurchases(purchases);
        } else {
          const filtered = purchases.filter((purchase) => {
            return (
              (purchase.partName && purchase.partName.toLowerCase().includes(term)) ||
              (purchase.vehicle && purchase.vehicle.toLowerCase().includes(term)) ||
              (purchase.category && purchase.category.toString().includes(term)) ||
              (purchase.vendor && purchase.vendor.toString().includes(term)) ||
              (purchase.invoiceNumber && purchase.invoiceNumber.toString().includes(term)) ||
              (purchase.document && purchase.document.toString().includes(term))               
            );
          });
          console.log("this are filtered records",filtered);
          
          setFilteredPurchases(filtered);
        }
      };

    const handleAddPurchase = (purchase) => {
        setPurchases([...purchases, purchase]);
        setAddModalOpen(false);
    };
    

    const handleEditPurchase = (updatedPurchase) => {
        setPurchases(
            purchases.map((purchase) =>
                purchase.id === updatedPurchase.id ? updatedPurchase : purchase
            )
        );
        setIsEditModalOpen(false);
    };

    const handleOpenAddModal = () => {
        setAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setAddModalOpen(false);
    };

    const handleOpenViewModal = (purchase) => {
        setCurrentPurchase(purchase);
        setIsViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
    };

    const handleOpenEditModal = (purchase) => {
        setCurrentPurchase(purchase);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleDelete = (purchase) => {
        if (window.confirm(`Are you sure you want to delete ${purchase.partName}?`)) {
            setPurchases(purchases.filter((p) => p.id !== purchase.id));
        }
    };

    const handlePrint = (purchase) => {
        const printOption = window.prompt(
            'Enter your choice: 1 for PDF, 2 for Excel'
        );

        if (printOption === '1') {
            alert('Generating PDF for: ' + purchase.partName);
        } else if (printOption === '2') {
            alert('Generating Excel for: ' + purchase.partName);
        } else {
            alert('Invalid choice');
        }
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
                      value={searchTerm}
                      onChange={handleSearch }
                    />
                  </CInputGroup>
                  <Button variant="contained"  onClick={handleOpenAddModal} style={{ background:'orange', color:'white', width:'8.1rem'}}>
                    Add New 
                  </Button>
            
                  </div>
                  </header>

            <PurchaseList 
                purchases={filteredPurchases} 
                searchTerm={searchTerm} 
                onView={handleOpenViewModal} 
                onEdit={handleOpenEditModal} 
                onDelete={handleDelete} 
                onPrint={handlePrint} 
            />

            
                    <PurchaseForm   addModalOpen={addModalOpen} setAddModalOpen={setAddModalOpen} handleAddModalClose={handleCloseAddModal}/>
           

            <Modal open={isViewModalOpen} onClose={handleCloseViewModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <ViewPurchaseModal purchase={currentPurchase} onClose={handleCloseViewModal} />
                </Box>
            </Modal>

            <Modal open={isEditModalOpen} onClose={handleCloseEditModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <EditPurchaseForm 
                        purchase={currentPurchase} 
                        onEditPurchase={handleEditPurchase} 
                        onCancel={handleCloseEditModal} 
                    />
                </Box>
            </Modal>
        </div>
    );
};

export default Purchase;