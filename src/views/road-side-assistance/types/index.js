/* eslint-disable prettier/prettier */
export const ServiceRecord = {
  id: String,
  driverId: String,
  vehicleId: String,
  serviceType: String,
  cost: Number,
  date: String,
  location: {
    lat: Number,
    lng: Number,
    address: String,
  },
  serviceProvider: String,
  receiptImage: String,
}

export const Driver = {
  id: String,
  name: String,
  allocatedBudget: Number,
  spentBudget: Number,
}

export const Trip = {
  id: String,
  driverId: String,
  vehicleId: String,
  startLocation: String,
  endLocation: String,
  startDate: String,
  endDate: String,
  allocatedBudget: Number,
  serviceRecords: ServiceRecord,
}
