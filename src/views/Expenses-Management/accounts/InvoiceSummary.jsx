import React from 'react';

const InvoiceSummary = ({ invoices }) => {
    const validInvoices = Array.isArray(invoices) ? invoices : [];
  const totalAmount = validInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const outstandingAmount = validInvoices.reduce(
    (sum, invoice) => (invoice.status === 'pending' ? sum + invoice.amount : sum),
    0
  );

  return (
    <div >
      <h2>Summary</h2>
      <div className='d-flex justify-content-around align-items-baseline'>
        <div className='btn btn-secondary'>
        <p>Total Invoices: {invoices.length}</p>

        </div>
        <div className='btn btn-secondary'>
        <p>Total Amount: ${totalAmount.toFixed(2)}</p>

        </div>
        <div className='btn btn-secondary'>
        <p>Outstanding Amount: ${outstandingAmount.toFixed(2)}</p>

        </div>
      </div>
      
    </div>
  );
};

export default InvoiceSummary;
