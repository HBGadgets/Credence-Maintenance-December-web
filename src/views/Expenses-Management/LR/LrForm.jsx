import React, { useState } from 'react'
import {
  Modal,
  IconButton,
  Box,
  Button,
  TextField,
  Typography,
  TextareaAutosize,
  InputAdornment,
} from '@mui/material'
// import axios from 'axios';
// import { Close, Person, LocationOn, Inventory, MonetizationOn } from '@mui/icons-material';
import {
  Close,
  DateRange,
  DirectionsCar,
  Person,
  LocationOn,
  Inventory,
  AttachMoney,
  MonetizationOn,
  LocalShipping,
  Receipt,
  Percent,
  Scale,
  Straighten,
  LocalOffer,
  Home,
} from '@mui/icons-material'

import CloseIcon from '@mui/icons-material/Close'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  height: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto', // Enable vertical scrolling
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
  margintop: '8px',
}

const LRForm = ({ handleAddModalClose, addModalOpen, setAddModalOpen }) => {
  const [formData, setFormData] = useState({
    lrNumber: '',
    date: '',
    vehicleNumber: '',
    owner: '',
    consignorName: '',
    consignorAddress: '',
    consigneeName: '',
    consigneeAddress: '',
    customer: '',
    from: '',
    to: '',
    driverName: '',
    driverContact: '',
    containerNumber: '',
    sealNumber: '',
    itemName: '',
    quantity: '',
    unit: '',
    actualWeight: '',
    chargedWeight: '',
    customerRate: '',
    totalAmount: '',
    transporterRate: '',
    totalTransporterAmount: '',
    transporterRateOn: '',
    customerRateOn: '',
    customerFreight: '',
    transporterFreight: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent the default form submission

    try {
      // Post the form data to the backend API
      // const response = await axios.post('http://localhost:5000/lrs', formData);
      console.log('LR Created:', response.data)

      // Clear the form after successful submission
      setFormData({
        lrNumber: '',
        date: '',
        vehicleNumber: '',
        owner: '',
        consignorName: '',
        consignorAddress: '',
        consigneeName: '',
        consigneeAddress: '',
        customer: '',
        from: '',
        to: '',
        driverName: '',
        driverContact: '',
        containerNumber: '',
        sealNumber: '',
        itemName: '',
        quantity: '',
        unit: '',
        actualWeight: '',
        chargedWeight: '',
        customerRate: '',
        totalAmount: '',
        transporterRate: '',
        totalTransporterAmount: '',
        transporterRateOn: '',
        customerRateOn: '',
        customerFreight: '',
        transporterFreight: '',
      })

      // Close the modal or reset state if needed
      handleAddModalClose()
    } catch (error) {
      console.error('Error creating LR:', error.response ? error.response.data : error.message)
      alert('Failed to create LR. Please try again.')
    }
  }

  return (
    <Modal
      open={addModalOpen}
      onClose={handleAddModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          ...style,
          backgroundColor: '#f7f9fc',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          padding: '30px',
        }}
      >
        <form onSubmit={handleSubmit} style={{ padding: '16px' }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
            <Typography variant="h5">Lorry Receipt (LR) Form</Typography>
            <IconButton onClick={handleAddModalClose}>
              <Close />
            </IconButton>
          </Box>

          {/* Basic Details */}
          <Typography variant="h6" gutterBottom>
            Basic Details
          </Typography>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} marginBottom={3}>
            <TextField
              label="LR Number"
              name="lrNumber"
              value={formData.lrNumber}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Inventory />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRange />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Vehicle Number"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DirectionsCar />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Owner"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Consignor Details */}
          <Typography variant="h6" gutterBottom>
            Consignor Details
          </Typography>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} marginBottom={3}>
            <TextField
              label="Consignor Name"
              name="consignorName"
              value={formData.consignorName}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              placeholder="Consignor Address"
              name="consignorAddress"
              value={formData.consignorAddress}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Home />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Consignee Details */}
          <Typography variant="h6" gutterBottom>
            Consignee Details
          </Typography>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} marginBottom={3}>
            <TextField
              label="Consignee Name"
              name="consigneeName"
              value={formData.consigneeName}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              placeholder="Consignee Address"
              name="consigneeAddress"
              value={formData.consigneeAddress}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Home />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Typography variant="h6" gutterBottom>
            Customer Details
          </Typography>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} marginBottom={3}>
            <TextField
              label="Customer Name"
              name="customerName"
              value={formData.consigneeName}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              placeholder="Customer Address"
              name="customerAddress"
              value={formData.consigneeAddress}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Home />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Route Details */}
          <Typography variant="h6" gutterBottom>
            Route Details
          </Typography>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} marginBottom={3}>
            <TextField
              label="From"
              name="from"
              value={formData.from}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="To"
              name="to"
              value={formData.to}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Cargo Details */}
          <Typography variant="h6" gutterBottom>
            Cargo Details
          </Typography>
          <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={2} marginBottom={3}>
            {/* <TextField
          label="Item Name"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
        />
        <TextField
          label="Quantity"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
        />
        <TextField
          label="Unit"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
        />
        <TextField
          label="Actual Weight"
          type="number"
          name="actualWeight"
          value={formData.actualWeight}
          onChange={handleChange}
        />
        <TextField
          label="Charged Weight"
          type="number"
          name="chargedWeight"
          value={formData.chargedWeight}
          onChange={handleChange}
        /> */}
            <TextField
              label="Item Name"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Inventory />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Scale />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Straighten />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Actual Weight"
              type="number"
              name="actualWeight"
              value={formData.actualWeight}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Scale />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Charged Weight"
              type="number"
              name="chargedWeight"
              value={formData.chargedWeight}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Scale />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Freight Details */}
          <Typography variant="h6" gutterBottom>
            Freight Details
          </Typography>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} marginBottom={3}>
            <TextField
              label="Customer Rate"
              type="number"
              name="customerRate"
              value={formData.customerRate}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Total Amount"
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Transporter Rate"
              type="number"
              name="transporterRate"
              value={formData.transporterRate}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalShipping />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Total Transporter Amount"
              type="number"
              name="totalTransporterAmount"
              value={formData.totalTransporterAmount}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Transporter Rate On"
              name="transporterRateOn"
              value={formData.transporterRateOn}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Percent />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Customer Rate On"
              name="customerRateOn"
              value={formData.customerRateOn}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Percent />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Customer Freight"
              type="number"
              name="customerFreight"
              value={formData.customerFreight}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Receipt />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Transporter Freight"
              type="number"
              name="transporterFreight"
              value={formData.transporterFreight}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Receipt />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* <div>
          <TextField
              label="Hamali"
              type="number"
              name="hamali"
              value={formData.hamali}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Sur Charges"
              type="number"
              name="surCharge"
              value={formData.surCharge}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="St Charges"
              type="number"
              name="stCharge"
              value={formData.customerFreight}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Risk charges"
              type="number"
              name="riskCharge"
              value={formData.riskCharge}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    
                  </InputAdornment>
                ),
              }}
            />
          </div> */}

          {/* Submit Button */}
          <Box textAlign="center">
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}

export default LRForm
