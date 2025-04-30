/* eslint-disable prettier/prettier */
import React from 'react'
import { useParams } from 'react-router-dom'
// import VehicleList from '../../components/VehicleList'
const VehicleList = React.lazy(() => import('./VehicleList'))
function Vehicle() {
  const { id } = useParams()
  return (
    <>
      <VehicleList id={id} />
    </>
  )
}

export default Vehicle
