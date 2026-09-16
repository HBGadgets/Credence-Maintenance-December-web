i

  const stampImage = useMemo(() => (isCancelled ? getCancelledStamp() : null), [isCancelled]);mport React, { useRef, useMemo } from 'react'
import html2pdf from 'html2pdf.js'
import './TpInvoiceBill.css'
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

const TpInvoiceBill = ({ invoiceData }) => {
  const invoiceRef = useRef()

  // Destructure with defaults
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
    materialOwner,
    materialAddress,
    startLocation,
    endLocation,
    containerNumber,
    sealNumber,
    itemName,
    itemQuantity,
    itemUnit,
    itemWeight,
    itemcost,
    updatedQuantityMT,
    customerRate,
    totalAmount,
    transporterRate,
    totalTransporterAmount,
    transporterRateOn,
    customerRateOn,
    customerFreight,
    transporterFreight,
    driverName,
    digitalSignature,
    receiptNo,
    issuedBy,
    receivedBy,
    status,
    products = [],
  } = invoiceData || {}

  const isCancelled = Boolean(
    status && typeof status === 'string' && status.trim().toLowerCase().startsWith('cancel')
  )

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0'
    return `₹${Number(amount).toLocaleString('en-IN')}`
  }

  // Handle PDF download
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
      filename: `Transport_Pass_${receiptNo || 'Invoice'}_${date || ''}.pdf`,
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
              <div>
                <h1>{companyName || 'Transport Company'}</h1>
                <p>{companyAddress || 'N/A'}</p>
                <p>
                  <strong>Date:</strong> {date || 'N/A'}
                </p>
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

        <div className="section two-column compact">
          <h3 style={{ margin: '0 auto' }}>
            <strong>Invoice No:</strong> {receiptNo || 'N/A'}
          </h3>
        </div>

        {/* Transport Details - Now includes driver name */}
        <div className="section two-column compact">
          <div className="cardtitle">
            <h3>Transport Detailszz</h3>
            <div className="details-row compact">
              <p>
                <strong>Issued By:</strong> {issuedBy || 'N/A'}
              </p>
              <p>
                <strong>Received By:</strong> {receivedBy || 'N/A'}
              </p>
            </div>
            <div className="details-row compact">
              <p>
                <strong>Vehicle:</strong> {vehicleName || 'N/A'}
              </p>
              <p>
                <strong>Material Owner:</strong> {materialOwner || 'N/A'}
              </p>
            </div>
            <div className="details-row compact">
              <p>
                <strong>Driver Name:</strong> {driverName || 'N/A'}
              </p>
              <p>
                <strong>Route:</strong> {startLocation || 'N/A'} → {endLocation || 'N/A'}
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

        {/* Material Owner Details */}
        <div className="section compact">
          <h3>Material Owner Details</h3>
          <div className="details-row compact">
            <p>
              <strong>Name:</strong> {materialOwner || 'N/A'}
            </p>
            <p>
              <strong>Address:</strong> {materialAddress || 'N/A'}
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div className="section compact">
          <h3>Product Details</h3>
          <table className="item-table compact">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Warehouse</th>
                <th>Quantity (MT)</th>
                <th>Bag Size</th>
                <th>Total Bags</th>
                <th>Updated Quantity(MT)</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.productName || 'N/A'}</td>
                    <td>{product.warehouseName || 'N/A'}</td>
                    <td>{product.quantityMT || 0}</td>
                    <td>{product.bagSize || 0}</td>
                    <td>{product.totalBags || 0}</td>
                    <td>{product.updatedQuantityMT || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No products listed
                  </td>
                </tr>
              )}
              {products.length > 1 && (
                <tr className="total-row">
                  <td colSpan="2">
                    <strong>Total</strong>
                  </td>
                  <td>
                    <strong>{products.reduce((sum, p) => sum + (p.quantityMT || 0), 0)}</strong>
                  </td>
                  <td></td>
                  <td>
                    <strong>{products.reduce((sum, p) => sum + (p.totalBags || 0), 0)}</strong>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Financial Details */}
        <div className="section two-column compact">
          <div className="cardtitle">
            <h3>Customer Charges</h3>
            <div className="details-row compact">
              <p>
                <strong>Rate On:</strong> {formatCurrency(customerRateOn)}
              </p>
              <p>
                <strong>Rate:</strong> {formatCurrency(customerRate)}
              </p>
            </div>
            <div className="details-row compact">
              <p>
                <strong>Freight:</strong> {formatCurrency(customerFreight)}
              </p>
              <p>
                <strong>Total Amount:</strong> {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>
          <div className="cardtitle">
            <h3>Transporter Charges</h3>
            <div className="details-row compact">
              <p>
                <strong>Rate On:</strong> {formatCurrency(transporterRateOn)}
              </p>
              <p>
                <strong>Rate:</strong> {formatCurrency(transporterRate)}
              </p>
            </div>
            <div className="details-row compact">
              <p>
                <strong>Freight:</strong> {formatCurrency(transporterFreight)}
              </p>
              <p>
                <strong>Total Amount:</strong> {formatCurrency(totalTransporterAmount)}
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
            <li>Payment due within 30 days of invoice date.</li>
          </ul>
          <div className="signature-section compact">
            <div className="signature-block">
              <strong>Authorized Signatory (Transporter):</strong>
              {digitalSignature ? (
                <img
                  src={digitalSignature}
                  alt="Digital Signature"
                  className="signature-image"
                  crossOrigin="anonymous"
                />
              ) : (
                <div style={{ height: '50px', marginTop: '10px' }}>
                  <span className="text-muted">No digital signature available</span>
                </div>
              )}
            </div>

            <div className="signature-names">
              {/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <strong style={{ fontSize: '11px', minWidth: '140px' }}>
                  Consignor Signature:
                </strong>
                <div style={{ flex: 1, borderBottom: '1px solid #000', marginLeft: '10px' }}></div>
              </div> */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <strong style={{ fontSize: '11px', minWidth: '140px' }}>
                  Consignee Signature:
                </strong>
                {/* <div style={{ flex: 1, borderBottom: '1px solid #000', marginLeft: '10px' }}></div */}
              </div>
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

export default TpInvoiceBill
