import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const PurchaseForm = ({ onAddPurchase, onCancel }) => {
    const [partName, setPartName] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [category, setCategory] = useState('');
    const [vendor, setVendor] = useState('');
    const [quantity, setQuantity] = useState('');
    const [costPerUnit, setCostPerUnit] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [document, setDocument] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddPurchase({
            id: Date.now(),
            partName,
            vehicle,
            category,
            vendor,
            quantity,
            costPerUnit,
            purchaseDate,
            invoiceNumber,
            document,
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Part Name" value={partName} onChange={(e) => setPartName(e.target.value)} required />
            <TextField label="Select Vehicle" value={vehicle} onChange={(e) => setVehicle(e.target.value)} required />
            <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
            <TextField label="Vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} required />
            <TextField label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            <TextField label="Cost Per Unit" type="number" value={costPerUnit} onChange={(e) => setCostPerUnit(e.target.value)} required />
            <TextField label="Purchase Date" type="date" InputLabelProps={{ shrink: true }} value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} required />
            <TextField label="Invoice/Bill Number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} required />
            <TextField label="Select Document" type="file" InputLabelProps={{ shrink: true }} onChange={(e) => setDocument(e.target.files[0]?.name || '')} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={onCancel}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">Add</Button>
            </Box>
        </Box>
    );
};

export default PurchaseForm;
