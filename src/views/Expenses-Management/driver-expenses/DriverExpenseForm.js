import React, { useState, useEffect } from 'react';
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react';
import { FaSave, FaTimes, FaFileUpload, FaMoneyBill, FaClipboard, FaCalendar, FaUser } from 'react-icons/fa';
import axios from 'axios';

const DriverExpenseForm = ({ modal, toggleModal, openModal, closeModal, selectedExpense, onRefresh }) => {
  const [formData, setFormData] = useState({
    driverId: '',
    expenseType: '',
    amount: '',
    description: '',
    date: '',
    documents: [],
  });

  const [drivers, setDrivers] = useState([]);

  // Fetch driver list
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/drivers`);
        setDrivers(response.data); // Assuming API returns an array of drivers with { _id, name }
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };
    fetchDrivers();
  }, []);

  useEffect(() => {
    if (selectedExpense) {
      setFormData({
        driverId: selectedExpense.driverId || '',
        expenseType: selectedExpense.expenseType,
        amount: selectedExpense.amount,
        description: selectedExpense.description,
        date: selectedExpense.date ? new Date(selectedExpense.date).toISOString().split('T')[0] : '',
        documents: [],
      });
    } else {
      setFormData({ driverId: '', expenseType: '', amount: '', description: '', date: '', documents: [] });
    }
  }, [selectedExpense]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, documents: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'documents') {
        formData.documents.forEach((file) => data.append('documents', file));
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      if (selectedExpense) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/driverExpense/${selectedExpense._id}`, data);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/driverExpense`, data);
      }
      onRefresh();
      // toggleModal();
      closeModal()
    } catch (error) {
      console.error('Error saving expense', error);
    }
  };

  return (
    <CModal visible={modal} onClose={closeModal}>
      <CModalHeader>
        <CModalTitle>{selectedExpense ? 'Edit Expense' : 'Add Expense'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          {/* Driver Selection Dropdown */}
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <FaUser />
            </CInputGroupText>
            <CFormSelect name="driverId" value={formData.driverId} onChange={handleChange}>
              <option value="">Select Driver</option>
              {drivers.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.name}
                </option>
              ))}
            </CFormSelect>
          </CInputGroup>

          {/* Expense Type */}
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <FaClipboard />
            </CInputGroupText>
            <CFormSelect name="expenseType" value={formData.expenseType} onChange={handleChange}>
              <option value="">Select Expense Type</option>
              <option value="Fuel">Fuel</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Other">Other</option>
            </CFormSelect>
          </CInputGroup>

          {/* Amount */}
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <FaMoneyBill />
            </CInputGroupText>
            <CFormInput type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} />
          </CInputGroup>

          {/* File Upload */}
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <FaFileUpload />
            </CInputGroupText>
            <CFormInput type="file" multiple onChange={handleFileChange} />
          </CInputGroup>

          {/* Description */}
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <FaClipboard />
            </CInputGroupText>
            <CFormTextarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
          </CInputGroup>

          {/* Date */}
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <FaCalendar />
            </CInputGroupText>
            <CFormInput type="date" name="date" value={formData.date} onChange={handleChange} />
          </CInputGroup>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={closeModal}>
          <FaTimes /> Cancel
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          <FaSave /> Save
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default DriverExpenseForm;
