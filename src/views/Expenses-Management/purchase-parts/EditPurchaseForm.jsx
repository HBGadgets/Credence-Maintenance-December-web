import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const EditPurchaseForm = ({ purchase, onEditPurchase, onCancel }) => {
    const [partName, setPartName] = useState(purchase?.partName || '');
    const [vehicle, setVehicle] = useState(purchase?.vehicle || '');
    const [category, setCategory] = useState(purchase?.category || '');
    const [vendor, setVendor] = useState(purchase?.vendor || '');
    const [quantity, setQuantity] = useState(purchase?.quantity || '');
    const [costPerUnit, setCostPerUnit] = useState(purchase?.costPerUnit || '');
    const [purchaseDate, setPurchaseDate] = useState(purchase?.purchaseDate || '');
    const [invoiceNumber, setInvoiceNumber] = useState(purchase?.invoiceNumber || '');
    const [document, setDocument] = useState(purchase?.document || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onEditPurchase({
            ...purchase,
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
                <Button type="submit" variant="contained" color="primary">Save</Button>
            </Box>
        </Box>
    );
};

export default EditPurchaseForm;
