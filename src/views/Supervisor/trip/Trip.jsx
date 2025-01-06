/* eslint-disable prettier/prettier */
import React from 'react'
const TripAssignmentForm = React.lazy(() => import('../../../components/TripAssignmentForm'))

function Trip() {
  return (
    <>
      <TripAssignmentForm />
    </>
  )
}
export default Trip
