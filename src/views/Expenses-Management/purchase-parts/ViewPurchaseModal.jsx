import React from 'react';
import { Typography, Box, Button } from '@mui/material';

const ViewPurchaseModal = ({ purchase, onClose }) => {
    return (
        <Box>
            <Typography variant="h6">View Purchase Details</Typography>
            <Typography>Part Name: {purchase?.partName}</Typography>
            <Typography>Vehicle: {purchase?.vehicle}</Typography>
            <Typography>Category: {purchase?.category}</Typography>
            <Typography>Vendor: {purchase?.vendor}</Typography>
            <Typography>Quantity: {purchase?.quantity}</Typography>
            <Typography>Cost Per Unit: {purchase?.costPerUnit}</Typography>
            <Typography>Purchase Date: {purchase?.purchaseDate}</Typography>
            <Typography>Invoice/Bill Number: {purchase?.invoiceNumber}</Typography>
            <Typography>Document: {purchase?.document}</Typography>
            <Box sx={{ textAlign: 'right', marginTop: 2 }}>
                <Button variant="contained" onClick={onClose}>Close</Button>
            </Box>
        </Box>
    );
};

export default ViewPurchaseModal;