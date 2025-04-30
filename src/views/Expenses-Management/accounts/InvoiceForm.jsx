import React, { useState, useEffect } from 'react'
// import axios from 'axios';
import {
  Modal,
  IconButton,
  Box,
  TextField,
  FormControl,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
  Grid,
  Typography,
  Button,
} from '@mui/material'

import { FaUserEdit } from 'react-icons/fa'
import { IoTrashBin } from 'react-icons/io5'

import CloseIcon from '@mui/icons-material/Close'
import InvoiceIcon from '@mui/icons-material/Receipt'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import StatusIcon from '@mui/icons-material/AssignmentTurnedIn'
import PercentIcon from '@mui/icons-material/Percent'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee'

import { IoPersonSharp } from 'react-icons/io5'
import { MdAlternateEmail } from 'react-icons/md'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  height: '90vh',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto', // Enable vertical scrolling
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
  margintop: '8px',
}
const initialFormState = {
  invoiceNumber: '',
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  date: '',
  paymentDueDate: '',
  status: 'unpaid',
  taxes: '',
  subTotal: '',
  grandTotal: '',
  items: [{ name: '', description: '', unitPrice: '', quantity: '', total: '' }],
}

const InvoiceForm = ({
  addModalOpen,
  setAddModalOpen,
  editModalOpen,
  setEditModalOpen,
  handleModalClose,
  invoiceToEdit,
  setFilteredInvoices,
  fetchInvoices,
}) => {
  const [invoiceData, setInvoiceData] = useState(initialFormState)
  const [customRate, setCustomRate] = useState(false)
  const [taxRate, setTaxRate] = useState(18)

  const taxTypes = [
    { value: 'GST', label: 'GST' },
    { value: 'CGST', label: 'CGST' },
    { value: 'SGST', label: 'SGST' },
    { value: 'IGST', label: 'IGST' },
  ]

  const taxRates = [
    { value: 18, label: '18%' },

    { value: 5, label: '5%' },
    { value: 12, label: '12%' },
    { value: 28, label: '28%' },
    { value: 'custom', label: 'Custom' },
  ]

  const handleTaxRateChange = (event) => {
    const value = event.target.value
    if (value === 'custom') {
      setCustomRate(true)
      setTaxRate('') // Reset the value for custom input
    } else {
      setCustomRate(false)
      setTaxRate(value)
    }
  }

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setInvoiceData({
      ...invoiceData,
      [name]: value,
    })
  }

  // Handle items' field changes
  const handleItemChange = (index, e) => {
    const { name, value } = e.target
    const updatedItems = [...invoiceData.items]
    updatedItems[index][name] = value
    updatedItems[index].total = updatedItems[index].unitPrice * updatedItems[index].quantity
    setInvoiceData({
      ...invoiceData,
      items: updatedItems,
    })
  }

  // Add new item to the list
  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        { name: '', description: '', unitPrice: '', quantity: '', total: '' },
      ],
    })
  }
  const handleAddModalClose = () => {
    setAddModalOpen(false)
    setInvoiceData(initialFormState)
  }
  const handleEditModalClose = () => {
    setEditModalOpen(false)
    setInvoiceData(initialFormState)
  }

  // Remove item from the list
  const removeItem = (index) => {
    const updatedItems = invoiceData.items.filter((_, i) => i !== index)
    setInvoiceData({
      ...invoiceData,
      items: updatedItems,
    })
  }

  // Handle form submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    const subTotal = invoiceData.items.reduce(
      (total, item) => total + parseFloat(item.unitPrice || 0) * parseFloat(item.quantity || 0),
      0,
    )

    const taxes = subTotal * 0.18 // Example: 18% tax
    const grandTotal = subTotal + taxes
    // Collect the data to send
    const invoiceToSend = {
      invoiceNumber: invoiceData.invoiceNumber,
      clientName: invoiceData.clientName,
      clientEmail: invoiceData.clientEmail,
      clientPhone: invoiceData.clientPhone,
      date: invoiceData.date,
      paymentDueDate: invoiceData.paymentDueDate,
      status: invoiceData.status,
      taxes: taxes,
      subTotal: subTotal,
      grandTotal: grandTotal,
      items: invoiceData.items.map((item) => ({
        name: item.name,
        description: item.description,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        total: item.total,
      })),
    }

    try {
      // Send invoice data to backend
      // const response = await axios.post('http://localhost:5000/Invoice', invoiceToSend);

      if (response.status === 201) {
        alert('Invoice created successfully')
        setInvoiceData(initialFormState)
        fetchInvoices()
        handleAddModalClose()
      }
    } catch (err) {
      console.error('Error creating invoice:', err.response?.data || err.message)
      alert(`Error: ${err.response?.data?.message || err.message}`)
    }
  }

  // +++++++++++++++++++++++++++++++++++EDITING+++++++++++++++++++++++++++++++++
  // Populate the form when editing
  useEffect(() => {
    if (invoiceToEdit) {
      setInvoiceData(invoiceToEdit)
    } else {
      setInvoiceData({ client: {}, items: [], taxes: 0, subTotal: 0, grandTotal: 0 })
    }
  }, [invoiceToEdit])

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    const subTotal = invoiceData.items.reduce((total, item) => total + item.total, 0)
    const taxes = subTotal * 0.18 // Example tax calculation
    const grandTotal = subTotal + taxes

    const updatedInvoice = {
      ...invoiceData,
      taxes,
      subTotal,
      grandTotal,
      items: invoiceData.items.map((item) => ({
        name: item.name,
        description: item.description,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        total: item.total,
      })),
    }

    try {
      const response = await fetch(`http://localhost:5000/Invoice/${invoiceData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedInvoice),
      })

      if (response.ok) {
        const updatedInvoiceFromServer = await response.json()
        setFilteredInvoices((prevInvoices) =>
          prevInvoices.map((invoice) =>
            invoice._id === updatedInvoiceFromServer._id ? updatedInvoiceFromServer : invoice,
          ),
        )
        alert('Invoice updated successfully')
        setInvoiceData(initialFormState)
        handleEditModalClose()
      } else {
        throw new Error('Failed to update invoice')
      }
    } catch (error) {
      console.error('Error updating invoice:', error)
      alert('Error updating invoice')
    }
  }

  return (
    <>
      {/* // +++++++++++++++++ ADD MODAL - CREATE INVOICE ++++++++++++++++++++++++++++++= */}

      <Box
        sx={{
          ...style,
          backgroundColor: '#f7f9fc',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          padding: '30px',
        }}
      >
        <form onSubmit={handleCreateSubmit}>
          <div className="d-flex justify-content-between">
            <div style={{ margin: 'auto' }}>
              <h2>Create New Invoice</h2>
            </div>
            {/* <IconButton
              // style={{ marginLeft: 'auto', marginTop: '-40px', color: '#aaa' }}
              onClick={handleModalClose}
            >
              <CloseIcon />
            </IconButton> */}
          </div>

          <div className="d-grid" style={{ gridTemplateColumns: '1fr 1fr', gridGap: '0rem 2rem' }}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <TextField
                label="Invoice Number"
                name="invoiceNumber"
                value={invoiceData.invoiceNumber}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InvoiceIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal">
              <TextField
                label="Client Name"
                name="clientName"
                value={invoiceData.clientName}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IoPersonSharp style={{ fontSize: '20px', color: 'gray' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal">
              <TextField
                label="Client Email"
                name="clientEmail"
                value={invoiceData.clientEmail}
                onChange={handleChange}
                required
                type="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdAlternateEmail style={{ fontSize: '20px', color: 'gray' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal">
              <TextField
                label="Client Phone"
                name="clientPhone"
                value={invoiceData.clientPhone}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal">
              <TextField
                label="Date"
                name="date"
                value={invoiceData.date}
                onChange={handleChange}
                required
                type="date"
                InputLabelProps={{ shrink: true }} // Ensures the label stays above the input
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal">
              <TextField
                label="Payment Due Date"
                name="paymentDueDate"
                value={invoiceData.paymentDueDate}
                onChange={handleChange}
                required
                type="date"
                InputLabelProps={{ shrink: true }} // Ensures the label stays above the input
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={invoiceData.status}
                onChange={handleChange}
                input={
                  <OutlinedInput
                    startAdornment={
                      <InputAdornment position="start">
                        <StatusIcon />
                      </InputAdornment>
                    }
                    label="Status"
                  />
                }
              >
                <MenuItem value="unpaid">Unpaid</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </Select>
            </FormControl>

            {/* <div>
            <label>Taxes</label>
            <input
              type="number"
              name="taxes"
              value={invoiceData.taxes}
              onChange={handleChange}
              required
            />
          </div> */}
            {/* <br></br> */}
          </div>

          {/* <h3>Items</h3>
          {invoiceData.items.map((item, index) => (
            <div key={index} style={{display:'grid', gridTemplateColumns:"1fr 1fr"}}>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                />
              </div>
              <div>
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                />
              </div>
              <div>
                <label>Unit Price</label>
                <input
                  type="number"
                  name="unitPrice"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                />
              </div>
              <div>
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                />
              </div>
              <div>
                <label>Total</label>
                <input
                  type="number"
                  name="total"
                  value={item.total}
                  onChange={(e) => handleItemChange(index, e)}
                  disabled
                />
              </div>
              <button type="button" onClick={() => removeItem(index)}>Remove Item</button>
              <hr></hr>
            </div>
          ))}
          <button type="button" onClick={addItem}>Add Item</button>
          <div>
            <label>Subtotal</label>
            <input
              type="number"
              name="subTotal"
              value={invoiceData.subTotal}
              onChange={handleChange}
              disabled
            />
          </div>

          <div>
            <label>Grand Total</label>
            <input
              type="number"
              name="grandTotal"
              value={invoiceData.grandTotal}
              onChange={handleChange}
              disabled
            />
          </div>
          <button type="submit">Submit </button> */}

          {/* Items Section */}
          <Typography variant="h5" gutterBottom>
            Items
          </Typography>
          {invoiceData.items.map((item, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
              <Grid container spacing={2}>
                {/* Item Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, e)}
                    fullWidth
                    required
                  />
                </Grid>

                {/* Item Description */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Description"
                    name="description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, e)}
                    fullWidth
                    required
                  />
                </Grid>

                {/* Unit Price */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Unit Price"
                    name="unitPrice"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, e)}
                    type="number"
                    fullWidth
                    required
                  />
                </Grid>

                {/* Quantity */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Quantity"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    type="number"
                    fullWidth
                    required
                  />
                </Grid>

                {/* Total */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Total"
                    name="total"
                    value={item.total}
                    onChange={(e) => handleItemChange(index, e)}
                    disabled
                    fullWidth
                  />
                </Grid>

                {/* Remove Item Button */}
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeItem(index)}
                    fullWidth
                  >
                    Remove Item
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ))}

          {/* Add Item Button */}
          <Box sx={{ mb: 2 }}>
            <Button variant="contained" color="primary" onClick={addItem}>
              Add Item
            </Button>
          </Box>
          <div
            className="d-grid "
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '0rem 2rem' }}
          >
            {/* Subtotal */}
            <FormControl fullWidth variant="outlined" margin="normal">
              <TextField
                label="Subtotal"
                name="subTotal"
                value={invoiceData.subTotal}
                onChange={handleChange}
                type="number"
                fullWidth
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CurrencyRupeeIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            {/* Tax Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <TextField
                  select
                  label="Tax Type"
                  name="taxType"
                  value={invoiceData.taxType}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PercentIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {taxTypes.map((tax) => (
                    <MenuItem key={tax.value} value={tax.value}>
                      {tax.label}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>

            {/* Tax Rate Field */}
            <FormControl fullWidth variant="outlined" margin="normal">
              <div>
                {!customRate ? (
                  <TextField
                    select
                    label="Tax Rate"
                    value={invoiceData.taxRate}
                    onChange={handleTaxRateChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PercentIcon />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {taxRates.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    label="Custom Tax Rate"
                    type="number"
                    value={invoiceData.taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PercentIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              </div>
            </FormControl>

            {/* Tax Amount */}
            <FormControl fullWidth variant="outlined" margin="normal">
              <TextField
                label="Tax Amount"
                name="taxAmount"
                value={invoiceData.taxAmount} // Calculate based on taxable value * tax rate
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CurrencyRupeeIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            {/* Grand Total */}
            <FormControl fullWidth variant="outlined" margin="normal">
              <TextField
                label="Grand Total"
                name="grandTotal"
                value={invoiceData.grandTotal}
                onChange={handleChange}
                type="number"
                fullWidth
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CurrencyRupeeIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </div>

          {/* Submit Button */}
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Box>
        </form>
      </Box>

      {/* // +++++++++++++++++ EDIT MODAL - UPDATE INVOICE ++++++++++++++++++++++++++++++= */}
    </>
  )
}

export default InvoiceForm
