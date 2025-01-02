import React from 'react';
import { CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell, CImage } from '@coreui/react';

const ExpensesTable = ({ expenses }) => (
    <div className="overflow-auto">
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
                {expenses.length > 0 ? (
                    expenses.map((expense) => (
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
                    ))
                ) : (
                    <CTableRow>
                        <CTableDataCell colSpan="6" className="text-center">
                            No expenses found.
                        </CTableDataCell>
                    </CTableRow>
                )}
            </CTableBody>
        </CTable>
    </div>
);

export default ExpensesTable;
