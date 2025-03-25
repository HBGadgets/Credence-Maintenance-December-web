// /* eslint-disable prettier/prettier */
// import React, { useEffect, useState } from 'react'
// import SingleSelectDropdown from '../../components/SingleSelectDropdown';
// import MultiSelectDropdown from '../../components/MultiSelectDropdown';
// import SearchInput from '../../components/SearchInput';
// import { CButton, CCard, CCardBody, CCardHeader } from '@coreui/react';
// import DocumentList from '../../components/DocumentManager';
// import DocumentUpload from '../../components/DocumentUploadButton';
// import DocumentManager from '../../components/DocumentManager';
// import ServiceInfo from '../../components/ServiceInfo';

// const DriverSalary = ({ vehicles = [] }) => {

//   // ALL USE STATES

//   // Single select
//   const [selectedOption, setSelectedOption] = useState(null);


//   // Muilt Select
//   const [muiltselectedValues, setMuiltSelectedValues] = useState([]);
//   const allDevicesOption = { value: "all", label: "All Vehicles" };
//   const devices = [
//     { deviceId: "1", name: "Car 1" },
//     { deviceId: "2", name: "Car 2" },
//     { deviceId: "3", name: "Truck 1" }
//   ];

//   // Search bar section

//   const [searchQuery, setSearchQuery] = useState("");
//   // const [filteredVehicles, setFilteredVehicles] = useState([]);

//   // useEffect(() => {
//   //   if (!Array.isArray(vehicles)) {
//   //     setFilteredVehicles([]); // Ensure filteredVehicles is always an array
//   //     return;
//   //   }

//   //   const search = searchQuery.toLowerCase().trim();

//   //   const filtered = vehicles.filter((vehicle) =>
//   //     ["name", "model", "category"].some(
//   //       (key) => vehicle[key] && vehicle[key].toLowerCase().includes(search)
//   //     )
//   //   );

//   //   // Only update state if filtered results have changed
//   //   setFilteredVehicles((prevFiltered) => {
//   //     const isSame =
//   //       prevFiltered.length === filtered.length &&
//   //       prevFiltered.every((v, i) => v === filtered[i]);

//   //     return isSame ? prevFiltered : filtered;
//   //   });
//   // }, [searchQuery, vehicles]);



//   // Upload Document 

//   const [documents, setDocuments] = useState([]);
//   const [uploadModalVisible, setUploadModalVisible] = useState(false);


//   // ---------------------------------------------------------------------------------------------------------------------- 

//   // ALL HANDLE CLICK

//   // Single select handle
//   const handleChange = (selectedOption) => {
//     setSelectedOption(selectedOption);
//   };

//   // Muilt Select Handle
//   const handleChange1 = (muiltselectedValues) => {
//     setMuiltSelectedValues(muiltselectedValues);;
//   };

//   //  Upload document handle

//   const handleUpload = (newDocs) => {
//     const formattedDocs = newDocs.map((doc) => ({
//       ...doc,
//       file: {
//         filename: doc.file?.filename || "",
//         contentType: doc.file?.contentType || "",
//         data: doc.file?.data || "",
//       },
//     }));

//     setDocuments([...documents, ...formattedDocs]);
//   };

//   const handleDelete = (docId) => {
//     const updatedDocs = documents.filter((_, index) => index !== docId);
//     setDocuments(updatedDocs);
//   };


//   // ---------------------------------------------------------------------------------------------------------------------- 

//   // ALL OPTION VALUES

//   // Single select option
//   const options = [
//     { value: "1", label: "One" },
//     { value: "2", label: "Two" },
//     { value: "3", label: "Three" },
//     { value: "4", label: "Four" },
//   ];


//   // Muilt select option
//   const options1 = [
//     allDevicesOption,
//     ...devices.map((device) => ({ value: device.deviceId, label: device.name })),

//   ];

//   // Services Info 
//   const selectedVehicle = {
//     mileage: "130,000 km",
//     lastMaintenance: "110,000 km",
//     nextMaintenance: "140,000 km",
//   };

//   const vehicleServiceData = [
//     { label: "Current Mileage", value: selectedVehicle.mileage },
//     { label: "Last Maintenance", value: selectedVehicle.lastMaintenance },
//     { label: "Next Maintenance", value: selectedVehicle.nextMaintenance, highlight: true },
//   ];



//   return (
//     <>
//       <h1>Drivers Salary</h1>
//       <br />

//       {/* SingleSelectDropdown */}

//       <h3>Single Select Option</h3>

//       <SingleSelectDropdown
//         label="Choose an option"
//         options={options}
//         value={selectedOption}
//         onChange={handleChange}
//         placeholder="Search or select..."
//       />
//       <p>Selected: {selectedOption ? selectedOption.label : ""}</p>

//       <hr /><br />

//       {/* ---------------------------------------------------------------------------  */}

//       {/* MuiltDropDown */}

//       <h3> Muilt Select Option</h3>

//       <MultiSelectDropdown
//         id="vehicles"
//         label="Choose Vehicles"
//         options={options1}
//         value={muiltselectedValues}
//         onChange={handleChange1}
//         placeholder="Select vehicles..."
//       />
//       <p>Selected: {muiltselectedValues.map((opt) => opt.label).join(", ")}</p>

//       <hr /> <br />

//       {/* --------------------------------------------------------------------------------------  */}

//       {/* Search Bar  */}

//       <h3>Search bar</h3>

//       <div>
//         <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

//         {/* <ul>
//           {filteredVehicles.length > 0 ? (
//             filteredVehicles.map((vehicle, index) => (
//               <li key={index}>
//                 {vehicle.name} - {vehicle.model}
//               </li>
//             ))
//           ) : (
//             <li>No results found</li>
//           )}
//         </ul> */}
//       </div>
//       <hr />
//       <br />

//       {/* ------------------------------------------------------------------------------------------------- */}

//       {/* Document locker */}

//       <h3>Document locker</h3>
//       <div>
//         <DocumentManager />
//       </div>
//       <hr />
//       <br />

//       {/* ------------------------------------------------------------------------------------------------- */}

//       <h3>Vehicle Service Info</h3>

//       <ServiceInfo title="Services Information" data={vehicleServiceData} />

//       <hr />
//       <br />

//       {/* ------------------------------------------------------------------------------------------------- */}






//     </>
//   )
// }

// export default DriverSalary



import React from "react";
import { Ghost, Home, ArrowRight } from "lucide-react";
import "../../pages/page404/page404.css"; // Import custom CSS file

const Page404 = () => {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ marginTop: '65px' }}>
      <div className="text-center">
        {/* Ghost Animation */}
        <div className="position-relative mb-4">
          <Ghost className="ghost-icon text-primary" />
          <div className="shadow-circle"></div>
        </div>

        {/* Error Message */}
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <h2 className="fs-3 fw-semibold text-dark">Page Not Found</h2>
        <p className="text-muted mb-4">
          Oops! It seems like you've ventured into uncharted territory. The page
          you're looking for might have moved or doesn't exist.
        </p>

        {/* Action Buttons */}
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <a href="/" className="btn btn-primary d-flex align-items-center">
            <Home className="me-2" />
            Back to Home
          </a>
          <a href="/contact" className="btn btn-outline-secondary d-flex align-items-center">
            Contact Support
            <ArrowRight className="ms-2" />
          </a>
        </div>

        {/* Additional Help */}
        <div className="mt-4 text-muted small">
          <p>Need immediate assistance? Email us at support@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default Page404;
