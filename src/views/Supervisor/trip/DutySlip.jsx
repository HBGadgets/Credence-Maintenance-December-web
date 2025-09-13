import React, { useRef, useMemo } from 'react'
import html2pdf from 'html2pdf.js'
import './dutyslip.css'

const DutySlip = ({ invoiceData }) => {
  const invoiceRef = useRef()

  // Extract raw fields
  const {
    companyId,
    clientName,
    clientNumber,
    clientAdvance,
    budgetAllocated,
    coastPerKm,
    startLocation,
    endLocation,
    date,
    updatedAt,
    driverId,
    vehicleId,
    vehicleName,
    materialType,
    startOdometerReading,
    endOdometerReading,
    mileage,
  } = invoiceData || {}

  // Calculate total km & fuel consumption
  const { totalKmReading, fuelConsumption } = useMemo(() => {
    const totalKm =
      endOdometerReading && startOdometerReading
        ? (endOdometerReading - startOdometerReading).toFixed(2)
        : 0
    const fuel = mileage && totalKm ? (totalKm / mileage).toFixed(2) : 0
    return { totalKmReading: totalKm, fuelConsumption: fuel }
  }, [startOdometerReading, endOdometerReading, mileage])

  // Mapped fields
  const mappedData = {
    companyName: companyId?.companyName || 'N/A',
    companyAddress: companyId?.address || 'N/A',
    companyEmail: companyId?.email || 'N/A',
    companyMobile: companyId?.mobileNumber || 'N/A',
    companyOffice: companyId?.officeNumber || 'N/A',
    companyGST: companyId?.gstNumber || 'N/A',

    lorryNumber: vehicleId,
    date: date ? new Date(date).toLocaleDateString() : 'N/A',
    endDate: updatedAt ? new Date(updatedAt).toLocaleDateString() : 'N/A',

    vehicleName,
    driverName: driverId?.name || 'N/A',
    contactNumber: driverId?.contactNumber || 'N/A',
    startLocation,
    endLocation,
    itemName: materialType || 'N/A',
    customerName: clientName,
    customerContact: clientNumber || 'N/A',
    customerRate: coastPerKm,
    customerFreight: clientAdvance,
    transporterFreight: budgetAllocated,

    startOdometerReading,
    endOdometerReading,
    totalKmReading,
    fuelConsumption,
  }

  const handleDownloadPDF = () => {
    const element = invoiceRef.current.cloneNode(true)
    // Remove only the download button for PDF, keep signatures
    const button = element.querySelector('.magic-btn')
    if (button) button.remove()

    element.style.padding = '30px'
    element.style.backgroundColor = 'white'

    const opt = {
      margin: 0,
      filename: `DutySlip-${mappedData.lorryNumber || 'Bill'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }

    html2pdf().set(opt).from(element).save()
  }

  return (
    <div className="paper-wrap">
      <div className="bill-box" ref={invoiceRef}>
        {/* Header with company details */}
        <div className="header-section">
          <div className="company-details">
            <h1>{mappedData.companyName}</h1>
            <p>{mappedData.companyAddress}</p>
            <p>Email: {mappedData.companyEmail}</p>
            <p>
              Mobile: {mappedData.companyMobile} | Office: {mappedData.companyOffice}
            </p>
            <p>GST: {mappedData.companyGST}</p>
          </div>
          <div className="duty-title">
            <h2>Duty Slip</h2>
            <p>Date: {mappedData.date}</p>
          </div>
        </div>

        {/* Vehicle & Route */}
        <div className="slice-zone duo-flex">
          <div className="chunky-card">
            <h3>Vehicle Details</h3>
            <p>
              <strong>Slip Number:</strong> {mappedData.lorryNumber}
            </p>
            <p>
              <strong>Vehicle Name:</strong> {mappedData.vehicleName}
            </p>
            <p>
              <strong>Driver Name:</strong> {mappedData.driverName}
            </p>
            <p>
              <strong>Driver Contact:</strong> {mappedData.contactNumber}
            </p>
          </div>

          <div className="chunky-card">
            <h3>Route Details</h3>
            <p>
              <strong>Start Location:</strong> {mappedData.startLocation}
            </p>
            <p>
              <strong>End Location:</strong> {mappedData.endLocation}
            </p>
          </div>
        </div>

        {/* Material */}
        {invoiceData.transportMode === 'transport' && (
          <div className="slice-zone">
            <div className="chunky-card">
              <h3>Materials Details</h3>
              <p>
                <strong>Type:</strong> {mappedData.itemName}
              </p>
            </div>
          </div>
        )}

        {/* Client & Charges */}
        <div className="slice-zone duo-flex">
          <div className="chunky-card">
            <h3>Client Details</h3>
            <p>
              <strong>Name:</strong> {mappedData.customerName}
            </p>
            <p>
              <strong>Contact:</strong> {mappedData.customerContact}
            </p>
          </div>
          <div className="chunky-card">
            <h3>Charges</h3>
            <p>
              <strong>Rate (per km):</strong> ₹{mappedData.customerRate}
            </p>
            <p>
              <strong>Advance:</strong> ₹{mappedData.customerFreight}
            </p>
            <p>
              <strong>Budget Allocated:</strong> ₹{mappedData.transporterFreight}
            </p>
          </div>
        </div>

        {/* Trip Summary */}
        <div className="slice-zone">
          <div className="chunky-card">
            <h3>Trip Summary</h3>

            <div className="flex-rowed">
              <p>
                <strong>Trip Start Date:</strong> {mappedData.date}
              </p>
              <p>
                <strong>Trip End Date:</strong> {mappedData.endDate}
              </p>
            </div>

            {/* First row: Start & End Odometer */}
            <div className="flex-rowed">
              <p>
                <strong>Start Odometer:</strong> {mappedData.startOdometerReading}
              </p>
              <p>
                <strong>End Odometer:</strong> {mappedData.endOdometerReading}
              </p>
            </div>

            {/* Second row: Total KM & Fuel Consumption */}
            <div className="flex-rowed">
              <p>
                <strong>Total KM Reading:</strong> {mappedData.totalKmReading} km
              </p>
              <p>
                <strong>Fuel Consumption:</strong> {mappedData.fuelConsumption} liters
              </p>
            </div>
          </div>
        </div>

        {/* Footer with physical signatures */}
        <div className="bottom-bar">
          <div className="signature-section">
            <p>[Transport Company Stamp]</p>
            <div className="sign-row">
              <div className="sign-block">
                <p>
                  <strong>Authorized Signatory (Transporter)</strong>
                </p>
                <div className="signature-line"></div>
              </div>
              <div className="sign-block">
                <p>
                  <strong>Client Signature</strong>
                </p>
                <div className="signature-line"></div>
              </div>
            </div>
          </div>
          <button className="magic-btn" onClick={handleDownloadPDF}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export default DutySlip
