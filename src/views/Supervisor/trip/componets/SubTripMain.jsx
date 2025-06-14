// import React from 'react'
// import { useParams } from 'react-router-dom'
// import { useQuery } from '@tanstack/react-query'
// import { getSubTripsApi } from '../../data/data'

// const SubTripMain = () => {
//   const { id } = useParams()

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ['subTrip', id],
//     queryFn: () => getSubTripsApi(id),
//     enabled: !!id,
//   })

//   if (isLoading) return <div>Loading SubTrip data...</div>
//   if (isError) return <div>Error loading SubTrip data</div>

//   return (
//     <div>
//       <h4>SubTrip Details for Trip ID: {id}</h4>
//       <pre>{JSON.stringify(data, null, 2)}</pre>

//       {/* Correct usage of the fetched data */}
//     </div>
//   )
// }

// export default SubTripMain

import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

// Component Imports
import TripSummary from '../Modals/TripSummary'
import TripDetailsCard from '../Modals/TripDetailsCard'
import TripMap from '../Modals/TripMap'
import TripStatusChart from '../Modals/TripStatusChart'
import BudgetAllocationChart from '../Modals/BudgetAllocationChart'
import MaterialAnalysisChart from '../Modals/MaterialAnalysisChart'
import SubTripTable from '../Modals/SubTripTable'
import Loader from '../../../../components/Loader/Loader'
import { getSubTripsApi } from '../../data/data'

const SubTripMain = () => {
  const { id } = useParams()
  const [showSubTrips, setShowSubTrips] = useState(false) // ← Add toggle state

  const { data, isLoading, isError } = useQuery({
    queryKey: ['subTrip', id],
    queryFn: () => getSubTripsApi(id),
    enabled: !!id,
  })

  if (isLoading)
    return (
      <div className="text-center py-5">
        {' '}
        <Loader />{' '}
      </div>
    )
  if (isError) return <div className="text-danger text-center py-5">Error loading SubTrip data</div>

  const { mainTrip, subTrips } = data

  return (
    <div className="container-fluid">
      <div className="mb-3">
        <h2 className="fw-bold mb-1">Trip Analytics Overview</h2>
        <p className="text-muted">Comprehensive view of all trip metrics and performance</p>
      </div>

      {/* Top Summary Cards */}
      <div className="row g-4 mb-4">
        <TripSummary mainTrip={mainTrip} subTrips={subTrips} />
      </div>

      {/* Map and Details */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title">Trip Routes</h5>
              </div>
              <TripMap mainTrip={mainTrip} subTrips={subTrips} showSubTrips={showSubTrips} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-semibold mb-0">Trip Details</h5>
                <button
                  className="btn btn-sm btn-outline-primary px-3 rounded-pill"
                  onClick={() => setShowSubTrips((prev) => !prev)}
                >
                  {showSubTrips ? 'Hide SubTrips' : 'Show SubTrips'}
                </button>
              </div>
              <TripDetailsCard mainTrip={mainTrip} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <TripStatusChart subTrips={subTrips} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <BudgetAllocationChart subTrips={subTrips} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <MaterialAnalysisChart subTrips={subTrips} />
            </div>
          </div>
        </div>
      </div>

      {/* SubTrips Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          {/* <h5 className="card-title mb-3">Subtrips</h5> */}
          <SubTripTable subTrips={subTrips} />
        </div>
      </div>
    </div>
  )
}

export default SubTripMain
