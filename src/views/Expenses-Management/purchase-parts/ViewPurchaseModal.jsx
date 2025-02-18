import React from 'react'
import { Typography, Box, Button, Divider, Grid } from '@mui/material'

const ViewPurchaseModal = ({ purchase, onClose }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Purchase Details
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Part Name:
          </Typography>
          <Typography variant="body1">{purchase?.partName || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Vehicle:
          </Typography>
          <Typography variant="body1">{purchase?.vehicle || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Category:
          </Typography>
          <Typography variant="body1">{purchase?.category || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Vendor:
          </Typography>
          <Typography variant="body1">{purchase?.vendor || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Quantity:
          </Typography>
          <Typography variant="body1">{purchase?.quantity || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Cost Per Unit:
          </Typography>
          <Typography variant="body1">
            {purchase?.costPerUnit ? `$${purchase.costPerUnit}` : 'N/A'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Purchase Date:
          </Typography>
          <Typography variant="body1">{purchase?.purchaseDate || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Invoice/Bill Number:
          </Typography>
          <Typography variant="body1">{purchase?.invoiceNumber || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="textSecondary">
            Document:
          </Typography>
          <Typography variant="body1">{purchase?.document || 'N/A'}</Typography>
        </Grid>
      </Grid>
      <Box sx={{ textAlign: 'right', mt: 3 }}>
        <Button variant="contained" color="primary" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Box>
  )
}

export default ViewPurchaseModal
