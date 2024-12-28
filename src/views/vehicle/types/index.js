/* eslint-disable prettier/prettier */
export const MaintenanceRecord = {
  id: String,
  dateOfService: String,
  mileageOfService: Number,
  workedPerformed: String,
  serviceProvider: String,
  cost: Number,
  Notes: String,
}

export const Vehicle = {
  id: String,
  vehicleId: String,
  make: String,
  year: String,
  model: String,
  license: String,
  maintenanceRecord: MaintenanceRecord,
}
