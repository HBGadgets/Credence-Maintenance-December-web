/* eslint-disable prettier/prettier */
import React from 'react'
import VehicleTable from './VehicleTable'
import { vehicles } from '../data/data'
const VehicleMaintenanceLogs = () => {
  return <VehicleTable vehicles={vehicles} />
}

export default VehicleMaintenanceLogs
