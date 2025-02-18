import React, { useState, useEffect } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CSpinner,
} from '@coreui/react';
import { FaEdit, FaTrash, FaEye, FaPrint } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


// import { FaEye } from 'react-icons/fa'
import { FaUserEdit } from 'react-icons/fa'
import { IoTrashBin } from 'react-icons/io5'
// import { FaPrint } from 'react-icons/fa'
import IconDropdown from '../IconDropdown'
import { FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import { FaArrowUp } from 'react-icons/fa'
import { toast } from 'react-toastify'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const DriverExpenseList = ({ expenses, filteredExpenses, search, onEdit, onRefresh }) => {
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  

  useEffect(() => {
    if (expenses.length > 0) {
      setLoading(false); // Set loading to false when data is available
    }
  }, [expenses]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/driverExpense/${id}`);
        onRefresh();
      } catch (error) {
        console.error('Error deleting expense', error);
      }
    }
  };

  // const handleViewDocuments = async (id) => {
  //   navigate(`${}/documents`);
  // };

  // Define columns configuration with label and key
  const columns = [
    { label: "Driver Name", key: "driverName", sortable:true},
    { label: "Expense Type", key: "expenseType", sortable: true},
    { label: "Amount", key: "amount", sortable: true },
    { label: "Description", key: "description", sortable: true },
    { label: "Date", key: "date", sortable: true },
    { label: "Documents", key: "documents", sortable: true },
    { label: "Actions", key: "actions", sortable: true }
  ];

    // Inline styles for fade-in animation and loading spinner
    const styles = {
      fadeIn: {
        animation: 'fadeIn 0.5s ease-in-out',
      },
      loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
      },
      spinner: {
        fontSize: '2rem',
        color: '#007bff' // Make the spinner larger
      },
    };

      const handleSort = (key) => {
        if (!columns.find((column) => column.key === key && column.sortable)) return
    
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        setSortConfig({ key, direction })
    
        filteredExpenses.sort((a, b) => {
          if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
          if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
          return 0
        })
      }
    
      // Get sorting icon
      const getSortIcon = (key) => {
        if (sortConfig.key === key) {
          return sortConfig.direction === 'asc' ? '▲' : '▼'
        }
        return '↕'
      }
    
      // Reusable action buttons
      const ActionButtons = ({ purchase }) => (
        <div style={{ display: 'flex' }}>
          <CButton onClick={() => onView(purchase)} color="warning" size="sm">
            <FaEye size={18} />
          </CButton>
    
          <CButton className="ms-2" color="info" size="sm" onClick={() => onEdit(purchase)}>
            <FaUserEdit style={{ fontSize: '18px' }} />
          </CButton>
    
          <CButton color="danger" size="sm" className="ms-2" onClick={() => onDelete(purchase)}>
            <IoTrashBin style={{ fontSize: '18px' }} />
          </CButton>
    
          <CButton color="success" size="sm" className="ms-2" onClick={() => onPrint(purchase)}>
            <FaPrint style={{ fontSize: '18px' }} />
          </CButton>
        </div>
      )
    
      // Export to PDF function
      const exportToPDF = () => {
        try {
          if (!Array.isArray(filteredExpenses) || filteredExpenses.length === 0) {
            throw new Error('No data available for PDF export')
          }
    
          const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
          })
    
          // Add headers
          const headers = columns.map((column) => column.label)
    
          // Add data rows
          const data = filteredExpenses.map((purchase) =>
            columns.map((column) => purchase[column.key]?.toString() || ''),
          )
    
          // Generate table
          doc.autoTable({
            head: [headers],
            body: data,
            startY: 20,
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 2 },
            headStyles: { fillColor: [10, 45, 99], textColor: 255, fontStyle: 'bold' },
          })
    
          // Save PDF
          const filename = `Purchase_List_${new Date().toISOString().split('T')[0]}.pdf`
          doc.save(filename)
          toast.success('PDF downloaded successfully')
        } catch (error) {
          console.error('PDF Export Error:', error)
          toast.error(error.message || 'Failed to export PDF')
        }
      }
    
      // Export to Excel function
      const exportToExcel = () => {
        try {
          if (!Array.isArray(filteredExpenses) || filteredExpenses.length === 0) {
            throw new Error('No data available for Excel export')
          }
    
          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('Purchases')
    
          // Add headers
          worksheet.addRow(columns.map((column) => column.label))
    
          // Add data rows
          filteredExpenses.forEach((purchase) => {
            worksheet.addRow(columns.map((column) => purchase[column.key]?.toString() || ''))
          })
    
          // Save Excel file
          workbook.xlsx.writeBuffer().then((buffer) => {
            const filename = `Purchase_List_${new Date().toISOString().split('T')[0]}.xlsx`
            saveAs(new Blob([buffer]), filename)
            toast.success('Excel file downloaded successfully')
          })
        } catch (error) {
          console.error('Excel Export Error:', error)
          toast.error(error.message || 'Failed to export Excel')
        }
      }
    
      // Handle logout function
      const handleLogout = () => {
        // Implement logout logic here
        console.log('Logout clicked')
      }
    
      // Dropdown items for export
      const dropdownItems = [
        {
          icon: FaRegFilePdf,
          label: 'Download PDF',
          onClick: () => exportToPDF(),
        },
        {
          icon: PiMicrosoftExcelLogo,
          label: 'Download Excel',
          onClick: () => exportToExcel(),
        },
        {
          icon: FaPrint,
          label: 'Print Page',
          onClick: () => window.print(),
        },
        {
          icon: HiOutlineLogout,
          label: 'Logout',
          onClick: () => handleLogout(),
        },
        {
          icon: FaArrowUp,
          label: 'Scroll To Top',
          onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        },
      ]

  return (
    <CTable striped hover responsive bordered>
      <CTableHead>
        <CTableRow className='text-nowrap text-center'>
          {columns.map((column, index) => (
            // <CTableHeaderCell key={column.key}>{column.label}</CTableHeaderCell>
            <CTableHeaderCell
              key={index}
              className="text-center"
              onClick={() => column.sortable && handleSort(column.key)}
              style={{ cursor: column.sortable ? 'pointer' : 'default' }}
              role="columnheader"
              aria-sort={sortConfig.key === column.key ? sortConfig.direction : 'none'}
            >
              {column.label} {column.sortable && getSortIcon(column.key)}
            </CTableHeaderCell>
          ))}
        </CTableRow>
      </CTableHead>
      <CTableBody>
  {loading ? ( // Display loading spinner until data is fetched
    <CTableRow>
      <CTableDataCell colSpan={columns.length} className="text-center">
        <div style={styles.loadingContainer}>
          <CSpinner style={styles.spinner} size="xl" />
          <p>Loading expenses, please wait...</p>
        </div>
      </CTableDataCell>
    </CTableRow>
  ) : (
    filteredExpenses.map((expense) => (
      <CTableRow key={expense._id} className='text-nowrap text-center'>
        {columns.map((column) => (
          <CTableDataCell key={column.key}>
            {column.key === 'date' ? (
              expense[column.key] && !isNaN(new Date(expense[column.key]).getTime())
                ? new Date(expense[column.key]).toLocaleDateString()
                : '' // If date is invalid or doesn't exist, return an empty string
            ) : column.key === 'documents' ? (
              <CButton onClick={()=>{navigate(`${expense._id}/documents`);}}>View</CButton>
            ) : column.key === 'actions' ? (
              <>
                <CButton color="warning" size="sm">
                  <FaEye size={18} />
                </CButton>
                <CButton className="ms-2" color="info" size="sm" onClick={() => onEdit(expense)}>
                  <FaUserEdit style={{ fontSize: '18px' }} />
                </CButton>
                <CButton color="danger" size="sm" className="ms-2" onClick={() => handleDelete(expense._id)}>
                  <IoTrashBin style={{ fontSize: '18px' }} />
                </CButton>
                <CButton color="success" size="sm" className="ms-2">
                  <FaPrint style={{ fontSize: '18px' }} />
                </CButton>
              </>
            )
            : column.key === "driverName"
            ? expense.driverId?.name || "N/A" // Fetch driver name or show 'N/A'
            : expense[column.key]
          }
          </CTableDataCell>
        ))}
      </CTableRow>
    ))
  )}
</CTableBody>

        <div style={{position: "fixed", bottom: "2rem", right: "0rem", "z-index": 1000 }}>
            <IconDropdown items={dropdownItems} />
        </div>
    </CTable>
  );
};

export default DriverExpenseList;
