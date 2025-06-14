// import React, { useState } from 'react'

// const SubTripTable = ({ subTrips }) => {
//   const [showAll, setShowAll] = useState(false)

//   const visibleTrips = showAll ? subTrips : subTrips.slice(0, 5)

//   console.log('datataa tripsaaa', visibleTrips)

//   const getStatusStyle = (status) => {
//     return {
//       display: 'inline-block',
//       minWidth: '90px',
//       padding: '4px 10px',
//       borderRadius: '12px',
//       textAlign: 'center',
//       textTransform: 'capitalize',
//       fontWeight: '500',
//       backgroundColor:
//         status === 'in-progress'
//           ? '#f5a623'
//           : status === 'completed'
//             ? '#28a745'
//             : status === 'cancelled'
//               ? '#dc3545'
//               : '#6c757d',
//       color: 'white',
//     }
//   }

//   return (
//     <div>
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Comapany Name</th>
//             <th>Route</th>
//             <th>Date</th>
//             <th>Budget</th>
//             <th>Status</th>
//             <th>Material</th>
//           </tr>
//         </thead>
//         <tbody>
//           {visibleTrips.length > 0 ? (
//             visibleTrips.map((trip) => (
//               <tr key={trip.id}>
//                 <td>{trip.companyName}</td>
//                 <td>
//                   {trip.startLocation} ➝ {trip.endLocation}
//                 </td>
//                 <td>{trip.date}</td>
//                 <td>₹{trip.budgetAllocated}</td>
//                 <td>
//                   <span style={getStatusStyle(trip.status)}>{trip.status}</span>
//                 </td>
//                 <td>{trip.materialType || '-'}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" className="text-center text-muted">
//                 No data available
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {subTrips.length > 5 && (
//         <div className="d-flex justify-content-end mt-2">
//           <button className="btn btn-primary" onClick={() => setShowAll(!showAll)}>
//             {showAll ? 'Show Less' : 'Show More'}
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// export default SubTripTable

import React, { useState, useEffect } from 'react'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'

const SubTripTable = ({ subTrips }) => {
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isFetching, setIsFetching] = useState(false)

  // Columns for reusable Table component
  const columns = [
    { label: 'Date', key: 'date' },
    { label: 'Company Name', key: 'companyName' },
    { label: 'Start Route', key: 'startLocation' },
    { label: 'End Route', key: 'endLocation' },
    {
      label: 'Budget',
      key: 'budgetAllocated',
      render: (row) => `₹${row.budgetAllocated}`,
    },
    {
      label: 'Status',
      key: 'status',
      render: (row) => <span style={getStatusStyle(row.status)}>{row.status}</span>,
    },
    { label: 'Material', key: 'materialType', render: (row) => row.materialType || '-' },
  ]

  const getStatusStyle = (status) => {
    return {
      display: 'inline-block',
      minWidth: '90px',
      padding: '4px 10px',
      borderRadius: '12px',
      textAlign: 'center',
      textTransform: 'capitalize',
      fontWeight: '500',
      backgroundColor:
        status === 'in-progress'
          ? '#f5a623'
          : status === 'completed'
            ? '#28a745'
            : status === 'cancelled'
              ? '#dc3545'
              : '#6c757d',
      color: 'white',
    }
  }

  useEffect(() => {
    setIsFetching(true)
    // You could add more logic here like sorting/filtering
    setFilteredData(subTrips)
    setIsFetching(false)
  }, [subTrips])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  return (
    <div>
      <Table
        title="Subtrips Trips"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value === -1 ? filteredData.length : value)
          setCurrentPage(1)
        }}
      />
    </div>
  )
}

export default SubTripTable
