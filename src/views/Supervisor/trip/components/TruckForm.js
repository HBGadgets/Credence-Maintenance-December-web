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
import { RiBillFill } from "react-icons/ri";
import { FaCalendarAlt } from "react-icons/fa";
import { FaTruckMoving, FaWeightHanging } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { TiLocation } from "react-icons/ti";
import { BiSolidCategory } from "react-icons/bi";
import { MdOutlineCurrencyRupee } from "react-icons/md";

const TruckForm = ({ visible, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        lrNumber: '',
        date: '',
        vehicleNumber: '',
        owner: '',
        consignorName: '',
        consignorAddress: '',
        consigneeName: '',
        consigneeAddress: '',
        customer: '',
        from: '',
        to: '',
        driverName: '',
        driverContact: '',
        containerNumber: '',
        sealNumber: '',
        itemName: '',
        quantity: '',
        unit: '',
        actualWeight: '',
        chargedWeight: '',
        customerRate: '',
        totalAmount: '',
        transporterRate: '',
        totalTransporterAmount: '',
        transporterRateOn: '',
        customerRateOn: '',
        customerFreight: '',
        transporterFreight: '',
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
        <CModal visible={visible} onClose={onClose} size="xl">
            <CModalHeader closeButton>
                <h5 className="mb-0">Lorry Receipt (LR) Form</h5>
            </CModalHeader>
            <CModalBody>
                <CForm onSubmit={handleSubmit}>
                    {/* Basic Details */}
                    <h5>Basic Details</h5>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <RiBillFill style={{ fontSize: '21px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="lrNumber"
                                    name="lrNumber"
                                    placeholder="Enter LR Number"
                                    value={formData.lrNumber}
                                    onChange={handleChange}
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <FaCalendarAlt style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </CInputGroup>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <FaTruckMoving style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="vehicleNumber"
                                    name="vehicleNumber"
                                    value={formData.vehicleNumber}
                                    onChange={handleChange}
                                    placeholder="Enter Vehicle Number"
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <IoPersonSharp style={{ fontSize: '20px', color: 'gray', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="owner"
                                    name="owner"
                                    value={formData.owner}
                                    onChange={handleChange}
                                    placeholder="Enter Owner Name"
                                />
                            </CInputGroup>
                        </CCol>
                    </CRow>
                    <hr />

                    {/* Consignor Details */}
                    <h5>Consignor Details</h5>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <IoPersonSharp style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="consignorName"
                                    name="consignorName"
                                    placeholder="Enter Consignor Name"
                                    value={formData.consignorName}
                                    onChange={handleChange}
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <AiFillHome style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="consignorAddress"
                                    name="consignorAddress"
                                    placeholder="Enter Consignor Address"
                                    value={formData.consignorAddress}
                                    onChange={handleChange}
                                />
                            </CInputGroup>
                        </CCol>
                    </CRow>
                    <hr />

                    <h5>Consignee Details</h5>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <IoPersonSharp style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="consigneeName"
                                    name="consigneeName"
                                    placeholder="Enter Consignee Name"
                                    value={formData.consigneeName}
                                    onChange={handleChange}
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <AiFillHome style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="consigneeAddress"
                                    name="consigneeAddress"
                                    placeholder="Enter Consignee Address"
                                    value={formData.consigneeAddress}
                                    onChange={handleChange}
                                />
                            </CInputGroup>
                        </CCol>
                    </CRow>
                    <hr />

                    <h5>Customer Details</h5>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <IoPersonSharp style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="customerName"
                                    name="customerName"
                                    placeholder="Enter Customer Name"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <AiFillHome style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="customerAddress"
                                    name="customerAddress"
                                    placeholder="Enter Customer Address"
                                    value={formData.customerAddress}
                                    onChange={handleChange}
                                />
                            </CInputGroup>
                        </CCol>
                    </CRow>
                    <hr />
                    <h5>Route Details</h5>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <TiLocation style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="from"
                                    name="from"
                                    value={formData.from}
                                    onChange={handleChange}
                                    placeholder="Enter From Location"
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <TiLocation style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="to"
                                    name="to"
                                    value={formData.to}
                                    onChange={handleChange}
                                    placeholder="Enter To Location"
                                />
                            </CInputGroup>
                        </CCol>
                    </CRow>
                    <hr />
                    <h5>Cargo Details</h5>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <IoPersonSharp style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="itemName"
                                    name="itemName"
                                    value={formData.itemName}
                                    onChange={handleChange}
                                    placeholder="Enter Item Name"
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <BiSolidCategory style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="quantity"
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    placeholder="Enter Quantity"
                                />
                            </CInputGroup>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <FaWeightHanging style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="unit"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    placeholder="Enter Unit"
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <FaWeightHanging style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="actualWeight"
                                    type="number"
                                    name="actualWeight"
                                    value={formData.actualWeight}
                                    onChange={handleChange}
                                    placeholder="Enter Actual Weight"
                                />
                            </CInputGroup>
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <FaWeightHanging style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="chargedWeight"
                                    type="number"
                                    name="chargedWeight"
                                    value={formData.chargedWeight}
                                    onChange={handleChange}
                                    placeholder="Enter Charged Weight"
                                />
                            </CInputGroup>
                        </CCol>
                    </CRow>
                    <hr />
                    {/* Freight Details */}
                    <h5>Freight Details</h5>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <MdOutlineCurrencyRupee style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="customerRate"
                                    type="number"
                                    name="customerRate"
                                    value={formData.customerRate}
                                    onChange={handleChange}
                                    placeholder="Enter Customer Rate"
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <MdOutlineCurrencyRupee style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="totalAmount"
                                    type="number"
                                    name="totalAmount"
                                    value={formData.totalAmount}
                                    onChange={handleChange}
                                    placeholder="Enter Total Amount"
                                />
                            </CInputGroup>
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <FaTruckMoving style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="transporterRate"
                                    type="number"
                                    name="transporterRate"
                                    value={formData.transporterRate}
                                    onChange={handleChange}
                                    placeholder="Enter Transporter Rate"
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <MdOutlineCurrencyRupee style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="totalTransporterAmount"
                                    type="number"
                                    name="totalTransporterAmount"
                                    value={formData.totalTransporterAmount}
                                    onChange={handleChange}
                                    placeholder="Enter Total Transporter Amount"
                                />
                            </CInputGroup>
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <MdOutlineCurrencyRupee style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="transporterRateOn"
                                    name="transporterRateOn"
                                    value={formData.transporterRateOn}
                                    onChange={handleChange}
                                    placeholder="Enter Transporter Rate On"
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <MdOutlineCurrencyRupee style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="customerRateOn"
                                    name="customerRateOn"
                                    value={formData.customerRateOn}
                                    onChange={handleChange}
                                    placeholder="Enter Customer Rate On"
                                />
                            </CInputGroup>
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <MdOutlineCurrencyRupee style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="customerFreight"
                                    type="number"
                                    name="customerFreight"
                                    value={formData.customerFreight}
                                    onChange={handleChange}
                                    placeholder="Enter Customer Freight"
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={6}>
                            <CInputGroup className="mt-4">
                                <CInputGroupText>
                                    <MdOutlineCurrencyRupee style={{ fontSize: '20px', color: 'gray' }} />
                                </CInputGroupText>
                                <CFormInput
                                    id="transporterFreight"
                                    type="number"
                                    name="transporterFreight"
                                    value={formData.transporterFreight}
                                    onChange={handleChange}
                                    placeholder="Enter Transporter Freight"
                                />
                            </CInputGroup>
                        </CCol>
                    </CRow>
                    <hr />
                    <div className="d-flex justify-content-end gap-2">
                        <CButton color="secondary" onClick={onClose}>
                            Cancel
                        </CButton>
                        <CButton type="submit" color="primary">
                            Submit
                        </CButton>

                    </div>
                </CForm>
            </CModalBody>
        </CModal>
    );
};

export default TruckForm;
