import React, { useState } from 'react';
import {
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CButton,
    CForm,
    CFormInput,
    CFormSelect,
    CInputGroup,
    CInputGroupText,
    CRow,
    CCol,
} from '@coreui/react';
import { Car, User, MapPin, Calendar, IndianRupee } from 'lucide-react';

const TaxiForm = ({ visible, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        vehicleId: '',
        driverId: '',
        categoryId: 'Taxi',
        startLocation: '',
        endLocation: '',
        startDate: '',
        budgetAlloted: '',
    });

    const vehicles = [
        { id: 'v1', name: 'Toyota Camry - KXA 123' },
        { id: 'v2', name: 'Honda Civic - KYB 456' },
        { id: 'v3', name: 'Tesla Model 3 - KZC 789' },
    ];

    const drivers = [
        { id: 'd1', name: 'John Smith' },
        { id: 'd2', name: 'Sarah Johnson' },
        { id: 'd3', name: 'Michael Brown' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <CModal className='py-5' visible={visible} onClose={onClose} size="lg">
            <CModalHeader closeButton>
                <h5 className="mb-0">New Taxi Trip</h5>
            </CModalHeader>
            <CModalBody>
                <CForm onSubmit={handleSubmit}>
                    <CRow>
                        <CCol md={6}>
                            <CInputGroup className="mb-4">
                                <CInputGroupText><Car size={20} /></CInputGroupText>
                                <CFormSelect name="vehicleId" value={formData.vehicleId} onChange={handleChange} required>
                                    <option value="">Select Vehicle</option>
                                    {vehicles.map(({ id, name }) => (
                                        <option key={id} value={name}>{name}</option>
                                    ))}
                                </CFormSelect>
                            </CInputGroup>
                        </CCol>

                        <CCol md={6}>
                            <CInputGroup className="mb-4">
                                <CInputGroupText><User size={20} /></CInputGroupText>
                                <CFormSelect name="driverId" value={formData.driverId} onChange={handleChange} required>
                                    <option value="">Select Driver</option>
                                    {drivers.map(({ id, name }) => (
                                        <option key={id} value={name}>{name}</option>
                                    ))}
                                </CFormSelect>
                            </CInputGroup>
                        </CCol>
                    </CRow>

                    <CRow>
                        <CCol md={6}>
                            <CInputGroup className="mb-4">
                                <CInputGroupText><MapPin size={20} /></CInputGroupText>
                                <CFormInput placeholder="Start Location" name="startLocation" value={formData.startLocation} onChange={handleChange} required />
                            </CInputGroup>
                        </CCol>

                        <CCol md={6}>
                            <CInputGroup className="mb-4">
                                <CInputGroupText><MapPin size={20} /></CInputGroupText>
                                <CFormInput placeholder="End Location" name="endLocation" value={formData.endLocation} onChange={handleChange} required />
                            </CInputGroup>
                        </CCol>
                    </CRow>

                    <CRow>
                        <CCol md={6}>
                            <CInputGroup className="mb-4">
                                <CInputGroupText><Calendar size={20} /></CInputGroupText>
                                <CFormInput type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                            </CInputGroup>
                        </CCol>

                        <CCol md={6}>
                            <CInputGroup className="mb-4">
                                <CInputGroupText><IndianRupee size={20} /></CInputGroupText>
                                <CFormInput type="number" placeholder="Budget" name="budgetAlloted" value={formData.budgetAlloted} onChange={handleChange} required />
                            </CInputGroup>
                        </CCol>
                    </CRow>
                    <hr />
                    <div className="d-flex justify-content-end gap-2">
                        <CButton color="secondary" onClick={onClose}>Cancel</CButton>
                        <CButton color="primary" type="submit">Submit</CButton>
                    </div>
                </CForm>
            </CModalBody>
        </CModal >
    );
};

export default TaxiForm;
