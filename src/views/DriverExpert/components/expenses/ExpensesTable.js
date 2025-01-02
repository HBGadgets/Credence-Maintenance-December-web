import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { CButton, CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell, CImage, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import DateRangeFilter from '../../common/DateRangeFilter';

export default function ExpensesTable({ expenses }) {
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleOpen = () => {
        setOpen(true);
    }

    // Filter expenses based on the date range
    const filteredExpenses = expenses.filter(expense => {
        if (!startDate || !endDate) return true;
        const date = new Date(expense.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
    });

    // Table component for displaying expenses
    const ExpensesContent = ({ data }) => (
        <CTable hover responsive bordered>
            <CTableHead>
                <CTableRow>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Vehicle</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Payment</CTableHeaderCell>
                    <CTableHeaderCell>Bill</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                {data.map((expense) => (
                    <CTableRow key={expense.id}>
                        <CTableDataCell>{expense.date}</CTableDataCell>
                        <CTableDataCell>{expense.vehicleName}</CTableDataCell>
                        <CTableDataCell>
                            <span className="badge bg-primary text-white">{expense.expenseType}</span>
                        </CTableDataCell>
                        <CTableDataCell>₹{expense.amount}</CTableDataCell>
                        <CTableDataCell>{expense.paymentType}</CTableDataCell>
                        <CTableDataCell>
                            <CImage
                                src={expense.billImage}
                                alt="Bill"
                                className="img-thumbnail"
                                style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                onClick={() => window.open(expense.billImage, '_blank')}
                            />
                        </CTableDataCell>
                    </CTableRow>
                ))}
            </CTableBody>
        </CTable>
    );

    return (
        <div>
            <div className="overflow-auto">
                <ExpensesContent data={filteredExpenses.slice(0, 5)} />
            </div>
            <div className="mt-4">
                <CButton
                    onClick={handleOpen}
                    color="link"
                    className="d-flex align-items-center text-primary"
                >
                    View All Expenses
                    <ChevronRight size={16} />
                </CButton>
            </div>

            <CModal
                alignment="center"
                scrollable
                visible={open}
                onClose={() => setOpen(false)}
                fullscreen
            >
                <CModalHeader>
                    <CModalTitle>All Expenses</CModalTitle>
                </CModalHeader>

                <CModalBody className="d-flex flex-column gap-3">
                    <DateRangeFilter
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                    />
                    <ExpensesContent data={filteredExpenses} />
                </CModalBody>
            </CModal>
        </div>
    );
}
