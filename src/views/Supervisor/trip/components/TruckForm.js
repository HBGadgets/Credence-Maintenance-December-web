import { useState } from "react";
import {
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CButton,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
    CCol,
} from "@coreui/react";
import { Calendar, Truck, User, Home, MapPin, Package, IndianRupee } from "lucide-react";

const TruckForm = ({ visible, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        lrNumber: "",
        date: "",
        vehicleNumber: "",
        owner: "",
        consignorName: "",
        consignorAddress: "",
        consigneeName: "",
        consigneeAddress: "",
        customerName: "",
        customerAddress: "",
        from: "",
        to: "",
        driverName: "",
        driverContact: "",
        containerNumber: "",
        sealNumber: "",
        itemName: "",
        quantity: "",
        unit: "",
        actualWeight: "",
        chargedWeight: "",
        customerRate: "",
        totalAmount: "",
        transporterRate: "",
        totalTransporterAmount: "",
        transporterRateOn: "",
        customerRateOn: "",
        customerFreight: "",
        transporterFreight: "",
        categoryId: "Truck",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <CModal visible={visible} onClose={onClose} size="lg">
            <CModalHeader closeButton>
                <h5 className="mb-0">Lorry Receipt (LR) Form</h5>
            </CModalHeader>
            <CModalBody>
                <CForm onSubmit={handleSubmit}>
                    <h5>Basic Details</h5>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mb-3">
                                <CInputGroupText><Package size={20} /></CInputGroupText>
                                <CFormInput name="lrNumber" placeholder="Enter LR Number" value={formData.lrNumber} onChange={handleChange} required />
                            </CInputGroup>
                        </CCol>
                        <CCol md={6}>
                            <CInputGroup className="mb-3">
                                <CInputGroupText><Calendar size={20} /></CInputGroupText>
                                <CFormInput type="date" name="date" value={formData.date} onChange={handleChange} required />
                            </CInputGroup>
                        </CCol>
                    </CRow>

                    <h5>Vehicle Details</h5>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mb-3">
                                <CInputGroupText><Truck size={20} /></CInputGroupText>
                                <CFormInput name="vehicleNumber" placeholder="Enter Vehicle Number" value={formData.vehicleNumber} onChange={handleChange} required />
                            </CInputGroup>
                        </CCol>
                        <CCol md={6}>
                            <CInputGroup className="mb-3">
                                <CInputGroupText><User size={20} /></CInputGroupText>
                                <CFormInput name="owner" placeholder="Enter Owner Name" value={formData.owner} onChange={handleChange} required />
                            </CInputGroup>
                        </CCol>
                    </CRow>

                    <h5>Consignor Details</h5>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mb-3">
                                <CInputGroupText><User size={20} /></CInputGroupText>
                                <CFormInput name="consignorName" placeholder="Enter Consignor Name" value={formData.consignorName} onChange={handleChange} required />
                            </CInputGroup>
                        </CCol>
                        <CCol md={6}>
                            <CInputGroup className="mb-3">
                                <CInputGroupText><Home size={20} /></CInputGroupText>
                                <CFormInput name="consignorAddress" placeholder="Enter Consignor Address" value={formData.consignorAddress} onChange={handleChange} required />
                            </CInputGroup>
                        </CCol>
                    </CRow>

                    <h5>Consignee Details</h5>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mb-3">
                                <CInputGroupText><User size={20} /></CInputGroupText>
                                <CFormInput name="consigneeName" placeholder="Enter Consignee Name" value={formData.consigneeName} onChange={handleChange} required />
                            </CInputGroup>
                        </CCol>
                        <CCol md={6}>
                            <CInputGroup className="mb-3">
                                <CInputGroupText><Home size={20} /></CInputGroupText>
                                <CFormInput name="consigneeAddress" placeholder="Enter Consignee Address" value={formData.consigneeAddress} onChange={handleChange} required />
                            </CInputGroup>
                        </CCol>
                    </CRow>

                    <h5>Route Details</h5>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mb-3">
                                <CInputGroupText><MapPin size={20} /></CInputGroupText>
                                <CFormInput name="from" placeholder="Enter From Location" value={formData.from} onChange={handleChange} required />
                            </CInputGroup>
                        </CCol>
                        <CCol md={6}>
                            <CInputGroup className="mb-3">
                                <CInputGroupText><MapPin size={20} /></CInputGroupText>
                                <CFormInput name="to" placeholder="Enter To Location" value={formData.to} onChange={handleChange} required />
                            </CInputGroup>
                        </CCol>
                    </CRow>

                    <h5>Driver Details</h5>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mb-3">
                                <CInputGroupText><User size={20} /></CInputGroupText>
                                <CFormInput name="driverName" placeholder="Enter Driver Name" value={formData.driverName} onChange={handleChange} required />
                            </CInputGroup>
                        </CCol>
                        <CCol md={6}>
                            <CInputGroup className="mb-3">
                                <CInputGroupText><User size={20} /></CInputGroupText>
                                <CFormInput name="driverContact" placeholder="Enter Driver Contact" value={formData.driverContact} onChange={handleChange} required />
                            </CInputGroup>
                        </CCol>
                    </CRow>

                    <div className="d-grid gap-2">
                        <CButton color="primary" type="submit">
                            Create Trip
                        </CButton>
                    </div>
                </CForm>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>
                    Cancel
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default TruckForm;
