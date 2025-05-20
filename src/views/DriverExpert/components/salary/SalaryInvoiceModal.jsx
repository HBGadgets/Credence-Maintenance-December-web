import React, { useRef } from 'react'
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react'
import { formatDateToDDMMYYYY } from '../../../customhooks/useFormattedDate'
import html2pdf from 'html2pdf.js'

const SalaryInvoiceModal = ({ visible, onClose, salaryData }) => {
  const printRef = useRef()

  if (!salaryData) return null

  const { basicPay, overtime, incentives, deductions, netPay, createdAt, originalDate } = salaryData

  const handleDownloadPDF = () => {
    const element = printRef.current
    const opt = {
      margin: 0.5,
      filename: `SalarySlip_${formatDateToDDMMYYYY(createdAt)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    }
    html2pdf().set(opt).from(element).save()
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg" scrollable>
      <CModalHeader closeButton>
        <h5 className="modal-titletool">Salary Slip</h5>
      </CModalHeader>
      <CModalBody>
        <div ref={printRef} style={styles.containertill}>
          <h3 style={styles.titletool}>Salary Slip</h3>

          <div style={styles.metalog}>
            <p>
              <strong>Date:</strong> {formatDateToDDMMYYYY(originalDate)}
            </p>
            <p>
              <strong>Slip No:</strong> SL-{new Date(originalDate).getTime()}
            </p>
          </div>

          <table style={styles.tabletip}>
            <tbody>
              <tr>
                <th style={styles.thoot}>Basic Pay</th>
                <td style={styles.tdot}>₹ {basicPay}</td>
              </tr>
              <tr>
                <th style={styles.thoot}>Overtime</th>
                <td style={styles.tdot}>₹ {overtime}</td>
              </tr>
              <tr>
                <th style={styles.thoot}>Incentives</th>
                <td style={styles.tdot}>₹ {incentives}</td>
              </tr>
              <tr>
                <th style={styles.thoot}>Deductions</th>
                <td style={styles.tdot}>₹ {deductions}</td>
              </tr>
              <tr style={styles.netPayRow}>
                <th style={styles.thoot}>
                  <strong>Net Pay</strong>
                </th>
                <td style={styles.tdot}>
                  <strong>₹ {netPay}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <div style={styles.footerNote}>
            <p>* This is a system-generated slip and does not require signature.</p>
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={handleDownloadPDF}>
          Download PDF
        </CButton>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

const styles = {
  containertill: {
    backgroundColor: '#fff',
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    width: '100%',
  },

  titletool: {
    textAlign: 'center',
    marginBottom: '20px',
    textDecoration: 'underline',
  },
  metalog: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  tabletip: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '30px',
  },
  thoot: {
    border: '1px solid #ccc',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    textAlign: 'left',
  },
  tdot: {
    border: '1px solid #ccc',
    padding: '10px',
  },
  netPayRow: {
    backgroundColor: '#d4edda',
  },
  footerNote: {
    fontStyle: 'italic',
    fontSize: '0.9rem',
    color: '#555',
  },
}

export default SalaryInvoiceModal
