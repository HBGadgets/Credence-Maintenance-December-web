import React, { useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import { ChevronRight } from 'lucide-react';
import SalaryDetail from './SalaryCard';
import DateRangeFilter from '../../common/DateRangeFilter';

const SalarySlipTable = ({ salaries }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    // Filter salaries based on the date range
    const filteredSalaries = salaries.filter(salary => {
        if (!startDate || !endDate) return true;
        const date = new Date(salary.month);
        return date >= new Date(startDate) && date <= new Date(endDate);
    });

    // Salary content for each salary slip
    const SalaryContent = ({ data }) => (
        <div className="space-y-4">
            {data.map((salary) => (
                <CCard key={salary.id}>
                    <CCardHeader>
                        Salary Slip - {new Date(salary.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </CCardHeader>
                    <CCardBody>
                        <div className="space-y-2">
                            <SalaryDetail label="Basic Pay" amount={salary.basicPay} />
                            <SalaryDetail label="Overtime" amount={salary.overtime} className="text-success" />
                            <SalaryDetail label="Incentives" amount={salary.incentives} className="text-success" />
                            <SalaryDetail label="Deductions" amount={salary.deductions} className="text-danger" />
                            <div className="border-top pt-2 mt-2">
                                <SalaryDetail label="Net Pay" amount={salary.netPay} className="text-lg font-weight-bold" />
                            </div>
                        </div>
                    </CCardBody>
                </CCard>
            ))}
        </div>
    );

    return (
        <div>
            <SalaryContent data={filteredSalaries.slice(0, 2)} />
            <div className="mt-4">
                <CButton
                    onClick={handleOpen}
                    color="link"
                    className="d-flex align-items-center text-primary"
                >
                    View All Salary Slips
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
                    <CModalTitle>All Salary Slips</CModalTitle>
                </CModalHeader>

                <CModalBody className="d-flex flex-column gap-3">
                    <DateRangeFilter
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                    />
                    <SalaryContent data={filteredSalaries} />
                </CModalBody>
            </CModal>
        </div>
    );
};

export default SalarySlipTable;
