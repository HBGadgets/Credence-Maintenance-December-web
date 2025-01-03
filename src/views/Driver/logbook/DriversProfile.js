import React from 'react';
import { useParams } from 'react-router-dom';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CImage,
} from '@coreui/react';
import AttendanceSection from './attendance/AttendanceSection';
import ExpensesTable from './expenses/ExpensesTable';
import TripsTable from './trips/TripsTable';
import SalarySlipTable from './salary/SalarySlipTable';
import { drivers } from './data/drivers';
import { expenses } from '../data/expenses';
import { trips } from '../data/trips';
import { salaries } from '../data/salaries';

const DriverProfile = () => {
    const { id } = useParams();

    const driver = drivers.find((d) => d.id === id);

    if (!driver) return <div>Driver not found</div>;

    const driverExpenses = expenses.filter((e) => e.driverId === id);
    const driverTrips = trips.filter((t) => t.driverId === id);
    const driverSalaries = salaries.filter((s) => s.driverId === id);

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <h1 className="text-center">{driver.name}</h1>
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="align-items-center">
                            <CCol md={3}>
                                <CImage
                                    rounded
                                    thumbnail
                                    fluid
                                    src={driver.profileImage}
                                    alt={driver.name}
                                    className="w-100 h-auto"
                                />
                            </CCol>
                            <CCol md={9}>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        <strong>License:</strong> {driver.licenseNumber}
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Aadhar:</strong> {driver.aadharNumber}
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Contact:</strong> {driver.contactNumber}
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Email:</strong> {driver.email}
                                    </li>
                                </ul>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>

                <CCard className="mb-4">
                    <CCardHeader>
                        <h2 className="text-center">Attendance</h2>
                    </CCardHeader>
                    <CCardBody>
                        <AttendanceSection driverId={id} />
                    </CCardBody>
                </CCard>

                <CCard className="mb-4">
                    <CCardHeader>
                        <h2 className="text-center">Expenses</h2>
                    </CCardHeader>
                    <CCardBody>
                        <ExpensesTable expenses={driverExpenses} />
                    </CCardBody>
                </CCard>

                <CCard className="mb-4">
                    <CCardHeader>
                        <h2 className="text-center">Trip Details</h2>
                    </CCardHeader>
                    <CCardBody>
                        <TripsTable trips={driverTrips} />
                    </CCardBody>
                </CCard>

                <CCard>
                    <CCardHeader>
                        <h2 className="text-center">Salary Slips</h2>
                    </CCardHeader>
                    <CCardBody>
                        <SalarySlipTable salaries={driverSalaries} />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default DriverProfile;
