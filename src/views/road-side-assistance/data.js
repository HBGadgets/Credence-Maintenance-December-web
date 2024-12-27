/* eslint-disable prettier/prettier */
export const serviceRecords = [
  {
    id: '1',
    driverId: 'D1',
    vehicleId: 'V1',
    serviceType: 'Tire Puncture',
    mileageAtService: 8755,
    cost: 500,
    date: '2024-12-20',
    location: {
      lat: 19.076,
      lng: 72.8777,
      address: 'Mumbai, Maharashtra',
    },
    serviceProvider: 'Quick Fix Garage',
    receiptImage: 'https://example.com/receipt1.jpg',
  },
  {
    id: '2',
    driverId: 'D1',
    vehicleId: 'V1',
    serviceType: 'Fuel Refill',
    mileageAtService: 17339,
    cost: 2000,
    date: '2024-12-22',
    location: {
      lat: 18.5204,
      lng: 73.8567,
      address: 'Pune, Maharashtra',
    },
    serviceProvider: 'Highway Fuel Station',
    receiptImage: 'https://example.com/receipt2.jpg',
  },
  {
    id: '3',
    driverId: 'D1',
    vehicleId: 'V1',
    serviceType: 'Engine Oil Change',
    mileageAtService: 20611,
    cost: 1500,
    date: '2024-12-23',
    location: {
      lat: 16.705,
      lng: 74.2433,
      address: 'Kolhapur, Maharashtra',
    },
    serviceProvider: 'Kolhapur Service Hub',
    receiptImage: 'https://example.com/receipt3.jpg',
  },
  {
    id: '4',
    driverId: 'D1',
    vehicleId: 'V1',
    serviceType: 'Coolant Refill',
    mileageAtService: 30000,
    cost: 600,
    date: '2024-03-24',
    location: {
      lat: 15.3173,
      lng: 75.7139,
      address: 'Hubli, Karnataka',
    },
    serviceProvider: 'Hubli Auto Care',
    receiptImage: 'https://example.com/receipt4.jpg',
  },
  {
    id: '5',
    driverId: 'D1',
    vehicleId: 'V1',
    serviceType: 'Brake Repair',
    mileageAtService: 40000,
    cost: 1800,
    date: '2024-03-27',
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Bangalore, Karnataka',
    },
    serviceProvider: 'Bangalore Service Center',
    receiptImage: 'https://example.com/receipt5.jpg',
  },
]

export const trip = {
  id: 'T1',
  driverId: 'D1',
  vehicleId: 'V1',
  startLocation: 'Mumbai',
  endLocation: 'Bangalore',
  startDate: '2024-12-20',
  endDate: '2024-12-27',
  allocatedBudget: 10000,
  serviceRecords: serviceRecords,
}
