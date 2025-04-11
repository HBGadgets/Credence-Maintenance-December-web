import React, { useRef } from 'react'
import html2pdf from 'html2pdf.js'
import './InvoiceBill.css'

const InvoiceBill = ({ invoiceData }) => {
  const invoiceRef = useRef()

  const handleDownloadPDF = () => {
    const downloadSection = invoiceRef.current.cloneNode(true)
    const footer = downloadSection.querySelector('.invoice-footer')
    if (footer) footer.remove()

    const opt = {
      margin: [0.2, 0.2, 0.2, 0.2], // smaller margins
      filename: `Invoice-${invoiceData?.lorryNumber || 'Bill'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1200,
      },
      jsPDF: {
        unit: 'pt',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
      },
      pagebreak: { avoid: ['.section', '.two-column', 'table'] },
    }

    html2pdf().set(opt).from(downloadSection).save()
  }

  const {
    companyName,
    companyAddress,
    companyEmail,
    gstIn,
    companyOfficeNumber,
    companyMobileNumber,
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
        <h2 className="title">Lorry Receipt (LR)</h2>

        <div className="section">
          <div className="two-column">
            <div>
              <h4>Transporter Information</h4>
              <p>
                <strong>Transporter Name:</strong> {companyName}
              </p>
              <p>
                <strong>Transporter Address:</strong> {companyAddress}
              </p>
              <p>
                <strong>Contact Email:</strong> {companyEmail}
              </p>
              <p>
                <strong>Contact Details:</strong> {companyOfficeNumber} / {companyMobileNumber}
              </p>
            </div>
            <div>
              <h4>Receipt Details</h4>
              <p>
                <strong>LR Number:</strong> {lorryNumber}
              </p>
              <p>
                <strong>Date of Issue:</strong> {date}
              </p>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="two-column">
            <div>
              <h4>Consignor (Sender) Details</h4>
              <p>
                <strong>Name:</strong> {consignorName}
              </p>
              <p>
                <strong>Address:</strong> {consignorAddress}
              </p>
              <p>
                <strong>GSTIN:</strong> {gstIn}
              </p>
              <p>
                <strong>Contact:</strong> {companyMobileNumber}
              </p>
            </div>
            <div>
              <h4>Consignee (Receiver) Details</h4>
              <p>
                <strong>Name:</strong> {consigneeName}
              </p>
              <p>
                <strong>Address:</strong> {consigneeAddress}
              </p>
              <p>
                <strong>GSTIN:</strong> {gstIn}
              </p>
              <p>
                <strong>Contact:</strong> {companyMobileNumber}
              </p>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="two-column">
            <div>
              <h4>Transportation Details</h4>
              <p>
                <strong>Vehicle Number:</strong> {vehicleName}
              </p>
              <p>
                <strong>Driver Name:</strong> {driverName}
              </p>
              <p>
                <strong>Driver Contact:</strong> {driverContact}
              </p>
              <p>
                <strong>Destination:</strong> {startLocation} → {endLocation}
              </p>
            </div>
            <div>
              <h4>Charges</h4>
              <table className="charges-table">
                <thead>
                  <tr>
                    <th>Charge Type</th>
                    <th>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Freight Charges</td>
                    <td>{customerFreight}</td>
                  </tr>
                  <tr>
                    <td>Other Charges (if any)</td>
                    <td>{transporterFreight}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Total Charges</strong>
                    </td>
                    <td>
                      <strong>{totalAmount}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="section">
          <h4>Goods Details</h4>
          <table className="goods-table">
            <thead>
              <tr>
                <th>Description of Goods</th>
                <th>Quantity</th>
                <th>Weight (KG)</th>
                <th>Value (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{itemName}</td>
                <td>
                  {itemQuantity} {itemUnit}
                </td>
                <td>{itemWeight}</td>
                <td>{itemcost}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="section">
          <h4>Terms and Conditions</h4>
          <ul>
            <li>Goods are transported at the owner's risk unless otherwise specified.</li>
            <li>
              Transporter is not liable for damages caused by natural calamities or accidents.
            </li>
            <li>Delivery will be made only upon presentation of the original lorry receipt.</li>
          </ul>
        </div>

        <div className="section signature-section">
          <p>
            <strong>Authorized Signatory (Transporter):</strong> ______________________
          </p>
          <p>Consignor: ______________________</p>
          <p>Consignee: ______________________</p>
        </div>

        <div className="invoice-footer text-center mt-5">
          <p className="stamp">[Transport Company Stamp]</p>
          <button className="btn btn-primary mt-2" onClick={handleDownloadPDF}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvoiceBill
