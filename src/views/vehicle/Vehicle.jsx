/* eslint-disable prettier/prettier */
import React from 'react'
// import VehicleList from '../../components/VehicleList'
const VehicleList = React.lazy(() => import('../../components/VehicleList'))
function Vehicle() {
  return (
    <>
      <VehicleList />
    </>
  )
}

export default Vehicle
