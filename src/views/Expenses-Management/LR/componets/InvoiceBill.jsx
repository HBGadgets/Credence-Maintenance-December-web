import React, { useRef } from 'react'
import html2pdf from 'html2pdf.js'
import './InvoiceBill.css'

const InvoiceBill = ({ invoiceData }) => {
  const invoiceRef = useRef()

  const handleDownloadPDF = () => {
    const element = invoiceRef.current

    // Hide all elements with class 'no-print' before generating PDF
    const noPrintElements = element.querySelectorAll('.no-print')
    noPrintElements.forEach((el) => (el.style.display = 'none'))

    const opt = {
      margin: 0.5,
      filename: `Invoice-${invoiceData?.lorryNumber || 'Bill'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    }

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        // Show the hidden elements again
        noPrintElements.forEach((el) => (el.style.display = ''))
      })
  }

  const {
    companyName,
    companyAddress,
    companyEmail,
    gstIn,
    officeNumber,
    mobileNumber,
    lorryNumber,
    date,
    vehicleName,
    ownerName,
    consignorName,
    consignorAddress,
    consigneeName,
    consigneeAddress,
    customerName,
    customerAddress,
    startLocation,
    endLocation,
    driverName,
    driverContact,
    containerNumber,
    sealNumber,
    itemName,
    itemQuantity,
    itemUnit,
    itemWeight,
    itemcost,
    customerRate,
    totalAmount,
    transporterRate,
    totalTransporterAmount,
    transporterRateOn,
    customerRateOn,
    customerFreight,
    transporterFreight,
  } = invoiceData || {}

  return (
    <div>
      <div className="invoice-container" ref={invoiceRef}>
        <div className="invoice-header">
          <h2>{companyName || 'Company Name'}</h2>
          <p>{companyAddress}</p>
          <p>
            Email: {companyEmail} | GSTIN: {gstIn}
          </p>
          <p>
            Office: {officeNumber} | Mobile: {mobileNumber}
          </p>
          <hr />
        </div>

        <div className="invoice-section">
          <strong>Lorry Receipt No.:</strong> {lorryNumber}
          <br />
          <strong>Date:</strong> {date}
        </div>

        <div className="invoice-section">
          <h4>Vehicle & Driver Details</h4>
          <p>
            Vehicle: {vehicleName} | Owner: {ownerName}
          </p>
          <p>
            Driver: {driverName} | Contact: {driverContact}
          </p>
          <p>
            Container No: {containerNumber} | Seal No: {sealNumber}
          </p>
        </div>

        <div className="invoice-section">
          <h4>Customer Details</h4>
          <p>Name: {customerName}</p>
          <p>Address: {customerAddress}</p>
          <p>
            From: {startLocation} → To: {endLocation}
          </p>
        </div>

        <div className="invoice-section">
          <h4>Consignor & Consignee</h4>
          <p>
            Consignor: {consignorName} - {consignorAddress}
          </p>
          <p>
            Consignee: {consigneeName} - {consigneeAddress}
          </p>
        </div>

        <div className="invoice-section">
          <h4>Item Details</h4>
          <p>
            {itemName} | {itemQuantity} {itemUnit} | Weight: {itemWeight}kg
          </p>
          <p>Item Cost: ₹{itemcost}</p>
        </div>

        <div className="invoice-section">
          <h4>Rates & Freight</h4>
          <p>
            Customer Rate: ₹{customerRate} on {customerRateOn}
          </p>
          <p>
            Transporter Rate: ₹{transporterRate} on {transporterRateOn}
          </p>
          <p>
            Customer Freight: ₹{customerFreight} | Transporter Freight: ₹{transporterFreight}
          </p>
          <p>
            Total Amount: ₹{totalAmount} | Transporter Total: ₹{totalTransporterAmount}
          </p>
        </div>

        {/* Footer only visible on screen, not in PDF */}
        <div className="invoice-footer text-center mt-5 no-print">
          <p>Thank you for your business!</p>
          <button className="btn btn-primary mt-2" onClick={handleDownloadPDF}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvoiceBill
