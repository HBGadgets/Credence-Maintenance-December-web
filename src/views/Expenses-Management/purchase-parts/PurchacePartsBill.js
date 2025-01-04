import React, { useState } from 'react';
import { Button, TextField, Typography, Modal, Box } from '@mui/material';
import PurchaseForm from './PurchaseForm';
import PurchaseList from './PurchaseList';
import ViewPurchaseModal from './ViewPurchaseModal';
import EditPurchaseForm from './EditPurchaseForm';
import purchasesData from './data';

const Purchase = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [purchases, setPurchases] = useState(purchasesData);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPurchase, setCurrentPurchase] = useState(null);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAddPurchase = (purchase) => {
        setPurchases([...purchases, purchase]);
        setIsAddModalOpen(false);
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
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
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
            <Typography variant="h4" gutterBottom>
                Purchase Expenses
            </Typography>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Button variant="contained" color="primary" onClick={handleOpenAddModal}>
                    Add New Purchased Item
                </Button>
            </div>

            <PurchaseList 
                purchases={purchases} 
                searchTerm={searchTerm} 
                onView={handleOpenViewModal} 
                onEdit={handleOpenEditModal} 
                onDelete={handleDelete} 
                onPrint={handlePrint} 
            />

            <Modal open={isAddModalOpen} onClose={handleCloseAddModal}>
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
                    <PurchaseForm onAddPurchase={handleAddPurchase} onCancel={handleCloseAddModal} />
                </Box>
            </Modal>

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