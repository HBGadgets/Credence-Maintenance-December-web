import React, { useState } from "react";
import TaxiForm from "./TaxiForm";
import TruckForm from "./TruckForm";
import { Truck, Car, PlusCircle } from "lucide-react";
import {
    CButton,
    CRow,
    CCol,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
} from "@coreui/react";

const TripForm = ({ onAddTrip }) => {
    const [showModal, setShowModal] = useState(false);
    const [tripType, setTripType] = useState(null);

    const handleTripTypeSelect = (type) => {
        setTripType(type);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setTripType(null);
    };

    const handleSubmit = (data) => {
        onAddTrip({ ...data, type: tripType });
        handleClose();
    };

    return (
        <div>
            <CRow className="mb-4">
                <CCol className="d-flex justify-content-end">
                    <CDropdown>
                        <CDropdownToggle color="primary" className="d-flex align-items-center gap-1">
                            <PlusCircle size={20} />
                            Add Trip
                        </CDropdownToggle>
                        <CDropdownMenu>
                            <CDropdownItem onClick={() => handleTripTypeSelect("taxi")}>
                                <Car size={16} className="me-2" />
                                Add Taxi Trip
                            </CDropdownItem>
                            <CDropdownItem onClick={() => handleTripTypeSelect("truck")}>
                                <Truck size={16} className="me-2" />
                                Add Truck Trip
                            </CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>
                </CCol>
            </CRow>

            {tripType === "taxi" && <TaxiForm visible={showModal} onClose={handleClose} onSubmit={handleSubmit} />}
            {tripType === "truck" && <TruckForm visible={showModal} onClose={handleClose} onSubmit={handleSubmit} />}
        </div>
    );
};

export default TripForm;
