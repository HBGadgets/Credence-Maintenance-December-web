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
    // Daily trip specific fields
    odometerStart,
    odometerEnd,
    totalDistance,
    vehicleNumber,
    driverName: rawDriverName,
    driverContact: rawDriverContact,
    createdAt,
    startTime,
    endTime,
  } = invoiceData || {}

  const effectiveStartOdo = startOdometerReading ?? odometerStart ?? 'N/A'
  const effectiveEndOdo = endOdometerReading ?? odometerEnd ?? 'N/A'

  // Calculate total km & fuel consumption
  const { totalKmReading, fuelConsumption } = useMemo(() => {
    let totalKm = 0
    if (endOdometerReading && startOdometerReading) {
      totalKm = (Number(endOdometerReading) - Number(startOdometerReading)).toFixed(2)
    } else if (
      odometerEnd !== undefined &&
      odometerStart !== undefined &&
      odometerEnd !== '-' &&
      odometerStart !== '-' &&
      !isNaN(odometerEnd) &&
      !isNaN(odometerStart)
    ) {
      totalKm = (Number(odometerEnd) - Number(odometerStart)).toFixed(2)
    } else if (totalDistance && totalDistance !== '-') {
      totalKm = Number(totalDistance).toFixed(2)
    }
    const fuel = mileage && Number(totalKm) > 0 ? (Number(totalKm) / mileage).toFixed(2) : 0
    return { totalKmReading: totalKm, fuelConsumption: fuel }
  }, [startOdometerReading, endOdometerReading, odometerStart, odometerEnd, totalDistance, mileage])

  const formatSlipDate = (d) => {
    if (!d || d === 'N/A' || d === '-') return 'N/A'
    const parsed = new Date(d)
    return isNaN(parsed.getTime()) ? d : parsed.toLocaleDateString()
  }

  // Mapped fields
  const mappedData = {
    companyName: companyId?.companyName || 'Credence Fleet Management',
    companyAddress: companyId?.address || 'N/A',
    companyEmail: companyId?.email || 'N/A',
    companyMobile: companyId?.mobileNumber || 'N/A',
    companyOffice: companyId?.officeNumber || 'N/A',
    companyGST: companyId?.gstNumber || 'N/A',

    lorryNumber: vehicleId || vehicleNumber || vehicleName || 'N/A',
    date: formatSlipDate(date || startTime || createdAt),
    endDate: formatSlipDate(updatedAt || endTime),

    vehicleName: vehicleName || vehicleNumber || (typeof vehicleId === 'string' ? vehicleId : 'N/A'),
    driverName: driverId?.name || rawDriverName || 'N/A',
    contactNumber: driverId?.contactNumber || rawDriverContact || 'N/A',
    startLocation: startLocation || 'Origin / Base',
    endLocation: endLocation || 'Destination / Return',
    itemName: materialType || 'N/A',
    customerName: clientName || 'Daily Operational Assignment',
    customerContact: clientNumber || 'N/A',
    customerRate: coastPerKm || '0',
    customerFreight: clientAdvance || '0',
    transporterFreight: budgetAllocated || '0',

    startOdometerReading: effectiveStartOdo,
    endOdometerReading: effectiveEndOdo,
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
      filename: `DutySlip-${mappedData.vehicleName || 'Bill'}.pdf`,
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
        {invoiceData?.transportMode === 'transport' && (
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
