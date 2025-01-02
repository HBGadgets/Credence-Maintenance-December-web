import React from 'react';
import SalaryDetail from './SalaryCard';
import { CCard, CCardBody, CCardHeader } from '@coreui/react';

const SalarySlipTable = ({ salaries }) => (
    <div className="space-y-4">
        {salaries.map((salary) => (
            <CCard key={salary.id} className="mb-4">
                <CCardHeader>
                    <h3 className="text-lg font-semibold">
                        Salary Slip - {new Date(salary.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
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

export default SalarySlipTable;
