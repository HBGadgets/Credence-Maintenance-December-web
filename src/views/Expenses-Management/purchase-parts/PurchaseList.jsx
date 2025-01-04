import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box } from '@mui/material';

const PurchaseList = ({ purchases, searchTerm, onView, onEdit, onDelete, onPrint }) => {
    const filteredPurchases = purchases.filter((purchase) =>
        purchase.partName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Part Name</TableCell>
                        <TableCell>Vehicle</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Vendor</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Cost Per Unit</TableCell>
                        <TableCell>Purchase Date</TableCell>
                        <TableCell>Invoice/Bill Number</TableCell>
                        <TableCell>Document</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredPurchases.map((purchase) => (
                        <TableRow key={purchase.id}>
                            <TableCell>{purchase.partName}</TableCell>
                            <TableCell>{purchase.vehicle}</TableCell>
                            <TableCell>{purchase.category}</TableCell>
                            <TableCell>{purchase.vendor}</TableCell>
                            <TableCell>{purchase.quantity}</TableCell>
                            <TableCell>{purchase.costPerUnit}</TableCell>
                            <TableCell>{purchase.purchaseDate}</TableCell>
                            <TableCell>{purchase.invoiceNumber}</TableCell>
                            <TableCell>{purchase.document}</TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        color="info"
                                        onClick={() => onView(purchase)}
                                    >
                                        View
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={() => onEdit(purchase)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => onDelete(purchase)}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => onPrint(purchase)}
                                    >
                                        Print
                                    </Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PurchaseList;
