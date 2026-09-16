import React, { useRef, useMemo } from 'react'
import html2pdf from 'html2pdf.js'
import './InvoiceBill.css'
import logo from '../../../../assets/brand/2.png'


const getCancelledStamp = () => {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 260;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(300, 130);
  ctx.rotate((-22 * Math.PI) / 180);

  const bw = 460;
  const bh = 104;
  const r = 12;

  const drawRoundRect = (x, y, w, h, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  // Outer border
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 5;
  drawRoundRect(-bw / 2, -bh / 2, bw, bh, r);
  ctx.stroke();

  // Inner border
  ctx.lineWidth = 2;
  drawRoundRect(-bw / 2 + 5, -bh / 2 + 5, bw - 10, bh - 10, r - 3);
  ctx.stroke();

  // Text
  ctx.fillStyle = '#dc2626';
  ctx.font = '900 52px "Arial Black", Impact, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const text = 'CANCELLED';
  const charSpacing = 10;
  let totalWidth = 0;
  for (let i = 0; i < text.length; i++) {
    totalWidth += ctx.measureText(text[i]).width + (i < text.length - 1 ? charSpacing : 0);
  }
  let currentX = -totalWidth / 2;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charWidth = ctx.measureText(char).width;
    ctx.fillText(char, currentX + charWidth / 2, 2);
    currentX += charWidth + charSpacing;
  }

  ctx.restore();
  return canvas.toDataURL('image/png');
};

const InvoiceBill = ({ invoiceData }) => {
  const invoiceRef = useRef()

  // Default empty object if invoiceData is undefined or null
  const {
    companyName,
    companyAddress,
    companyEmail,
    gstIn,
    companyOfficeNumber,
    companyMobileNumber,
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
    driverId,
    driverName,
    driverContact,
    status,
  } = invoiceData || {}

  const isCancelled = Boolean(
    status && typeof status === 'string' && status.trim().toLowerCase().startsWith('cancel')
  )

  const stampImage = useMemo(() => (isCancelled ? getCancelledStamp() : null), [isCancelled])

  const handleDownloadPDF = () => {
    const element = invoiceRef.current.cloneNode(true)
    const footer = element.querySelector('.invoice-footer')
    if (footer) footer.remove()

    element.style.padding = '20px'
    element.style.backgroundColor = 'white'
    element.style.fontFamily = "'Segoe UI', sans-serif"
    element.style.fontSize = '12px'
    element.style.position = 'relative'
    element.style.width = '100%'
    element.style.maxWidth = '100%'
    element.style.boxSizing = 'border-box'
    element.style.margin = '0 auto'
    element.style.transform = 'none'

    const stampOverlay = element.querySelector('.cancel-stamp-overlay')
    if (stampOverlay) {
      stampOverlay.style.position = 'absolute'
      stampOverlay.style.top = '36%'
      stampOverlay.style.left = '0px'
      stampOverlay.style.right = '0px'
      stampOverlay.style.width = '100%'
      stampOverlay.style.display = 'flex'
      stampOverlay.style.justifyContent = 'center'
      stampOverlay.style.alignItems = 'center'
      stampOverlay.style.textAlign = 'center'
      stampOverlay.style.margin = '0 auto'
    }
    const stampImg = element.querySelector('.cancel-stamp-img')
    if (stampImg) {
      stampImg.style.display = 'block'
      stampImg.style.margin = '0 auto'
      stampImg.style.maxWidth = '440px'
      stampImg.style.width = '60%'
    }

    const signature = element.querySelector('.signature-section')
    if (signature) {
      signature.style.pageBreakInside = 'avoid'
      signature.style.breakInside = 'avoid'
      signature.style.marginTop = '20px'
    }

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Transport Pass Receipt - ${
        companyName || 'Transport Pass'
      } - ${date || 'N/A'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
      },
      pagebreak: { avoid: '.signature-section' },
    }

    html2pdf().set(opt).from(element).save()
  }

  const handlePrint = () => {
    const originalContents = document.body.innerHTML
    const printContent = invoiceRef.current.innerHTML

    document.body.innerHTML = printContent
    window.print()
    document.body.innerHTML = originalContents
    window.location.reload()
  }

  return (
    <div className="invoice-wrapper">
      <div className="invoice" ref={invoiceRef}>
        {isCancelled && (
          <div className="cancel-stamp-overlay">
            {stampImage ? (
              <img
                src={stampImage}
                alt="CANCELLED"
                className="cancel-stamp-img"
              />
            ) : (
              <div className="cancel-stamp">CANCELLED</div>
            )}
          </div>
        )}
        {/* Header */}
        <div className="invoice-header">
          <div className="header-left">
            <div className="company-logo-name">
              {/* <img src={logo} alt="Company Logo" className="company-logo" crossOrigin="anonymous" /> */}
              <div>
                <h1>{companyName || 'N/A'}</h1>
                <p>{companyAddress || 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <p>
              <strong>GSTIN:</strong> {gstIn || 'N/A'}
            </p>
            <p>
              <strong>Email:</strong> {companyEmail || 'N/A'}
            </p>
            <p>
              <strong>Office:</strong> {companyOfficeNumber || 'N/A'}
            </p>
            <p>
              <strong>Mobile:</strong> {companyMobileNumber || 'N/A'}
            </p>
          </div>
        </div>

        {/* Vehicle & Route */}
        <div className="section two-column compact">
          <div className="cardtitle">
            <h3>Vehicle Details</h3>
            <div className="details-row compact">
              <p>
                <strong>Date:</strong> {date || 'N/A'}
              </p>
              <p>
                <strong>Owner:</strong> {ownerName || 'N/A'}
              </p>
            </div>
            <div className="details-row compact">
              <p>
                <strong>Vehicle:</strong> {vehicleName || 'N/A'}
              </p>
            </div>
          </div>
          <div className="cardtitle">
            <h3>Route Details</h3>
            <div className="details-row compact">
              <p>
                <strong>Destination:</strong> {startLocation || 'N/A'} → {endLocation || 'N/A'}
              </p>
              <p>
                <strong>Container No.:</strong> {containerNumber || 'N/A'}
              </p>
            </div>
            <div className="details-row compact">
              <p>
                <strong>Seal No.:</strong> {sealNumber || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Consignor & Consignee */}
        <div className="section two-column compact">
          <div className="cardtitle">
            <h3>Consignor Details</h3>
            <div className="details-row compact">
              <p>
                <strong>Name:</strong> {consignorName || 'N/A'}
              </p>
            </div>
            <div className="details-row compact">
              <p>
                <strong>Address:</strong> {consignorAddress || 'N/A'}
              </p>
            </div>
          </div>
          <div className="cardtitle">
            <h3>Consignee Details</h3>
            <div className="details-row compact">
              <p>
                <strong>Name:</strong> {consigneeName || 'N/A'}
              </p>
            </div>
            <div className="details-row compact">
              <p>
                <strong>Address:</strong> {consigneeAddress || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="section compact">
          <h3>Item Details</h3>
          <table className="item-table compact">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Weight (kg)</th>
                <th>Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{itemName || 'N/A'}</td>
                <td>{itemQuantity || 'N/A'}</td>
                <td>{itemUnit || 'N/A'}</td>
                <td>{itemWeight || 'N/A'}</td>
                <td>₹{itemcost?.toLocaleString() || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Customer & Transporter */}
        <div className="section two-column compact">
          <div className="cardtitle">
            <h3>Customer Details</h3>
            <div className="details-row compact">
              <p>
                <strong>Name:</strong> {customerName || 'N/A'}
              </p>
            </div>
            <div className="details-row compact">
              <p>
                <strong>Address:</strong> {customerAddress || 'N/A'}
              </p>
            </div>
            <div className="details-row compact">
              <p>
                <strong>Customer Rate On:</strong> ₹{customerRateOn || 0}
              </p>
              <p>
                <strong>Customer Rate:</strong> ₹{customerRate || 0}
              </p>
            </div>
            <div className="details-row compact">
              <p>
                <strong>Customer Freight:</strong> ₹{customerFreight?.toLocaleString() || 0}
              </p>
            </div>
          </div>
          <div className="cardtitle">
            <h3>Transporter Details</h3>
            <div className="details-row compact">
              <p>
                <strong>Driver Name:</strong> {driverName}
              </p>
            </div>
            <div className="details-row compact">
              <p>
                <strong>Transporter Rate On:</strong> ₹{transporterRateOn || 0}
              </p>
              <p>
                <strong>Transporter Rate:</strong> ₹{transporterRate || 0}
              </p>
            </div>
            <div className="details-row compact">
              <p>
                <strong>Transporter Freight:</strong> ₹{transporterFreight?.toLocaleString() || 0}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{totalTransporterAmount?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        {/* T&C and Signature */}
        <div className="invoice-page compact">
          <h3>Terms & Conditions</h3>
          <ul className="compact-terms">
            <li>Goods are transported at the owner's risk unless otherwise specified.</li>
            <li>
              Transporter is not liable for damages caused by natural calamities or accidents.
            </li>
            <li>Delivery will be made only upon presentation of the original lorry receipt.</li>
          </ul>
          <div className="signature-section compact">
            <div className="signature-block">
              <strong>Authorized Signatory (Transporter):</strong>
              {invoiceData?.digitalSignature ? (
                <img
                  src={invoiceData.digitalSignature}
                  alt="Digital Signature"
                  className="signature-image"
                  crossOrigin="anonymous"
                />
              ) : (
                <span className="signature-line">____________</span>
              )}
            </div>

            <div className="signature-names">
              <p>Consignor: ____________</p>
              <p>Consignee: ____________</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="invoice-footer text-center">
          <p className="stamp">[Transport Company Stamp]</p>
          <div className="action-buttons">
            <button className="download-btn" onClick={handleDownloadPDF}>
              Download PDF
            </button>
            <button className="print-btn" onClick={handlePrint}>
              Print Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceBill
