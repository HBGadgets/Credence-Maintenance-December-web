/* eslint-disable prettier/prettier */
export const MaintenanceRecord = {
  id: String,
  serviceDate: String,
  mileage: Number,
  workedPerformed: String,
  performedBy: String,
  cost: String,
  notes: String,
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
