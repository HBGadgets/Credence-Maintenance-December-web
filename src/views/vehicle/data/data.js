/* eslint-disable prettier/prettier */
export const vehicles = [
  {
    id: 'V001',
    make: 'Toyota',
    year: 2020,
    model: 'Camry',
    licenseNumber: 'ABC123',
    documents: [
      { name: 'Insurance', type: 'pdf' },
      { name: 'RC', type: 'pdf' },
      { name: 'PUC', type: 'pdf' },
      { name: 'Fitness Certificate', type: 'pdf' },
    ],
    maintenanceLogs: [
      {
        id: 'M001',
        serviceDate: '2023-01-15',
        mileage: 15000,
        workPerformed: 'Oil Change',
        performedBy: 'AutoCare Service',
        cost: 45.99,
        notes: 'Synthetic oil used',
      },
      {
        id: 'M002',
        serviceDate: '2023-06-20',
        mileage: 20000,
        workPerformed: 'Brake Pad Replacement',
        performedBy: 'Premium Auto Shop',
        cost: 299.99,
        invoiceUrl: 'https://example.com/invoice/M002',
      },
    ],
    trips: [
      { date: '2024-02-10', destination: 'New York', distance: '300 miles' },
      { date: '2024-02-05', destination: 'Boston', distance: '250 miles' },
    ],
  },
  {
    id: 'V002',
    make: 'Honda',
    year: 2021,
    model: 'Civic',
    licenseNumber: 'XYZ789',
    documents: [
      { name: 'Insurance', type: 'pdf' },
      { name: 'RC', type: 'pdf' },
      { name: 'PUC', type: 'pdf' },
      { name: 'Fitness Certificate', type: 'pdf' },
    ],
    maintenanceLogs: [
      {
        id: 'M003',
        serviceDate: '2023-03-10',
        mileage: 12000,
        workPerformed: 'Tire Rotation',
        performedBy: 'Quick Tire Service',
        cost: 29.99,
      },
      {
        id: 'M004',
        serviceDate: '2023-03-10',
        mileage: 15000,
        workPerformed: 'Tire Rotation',
        performedBy: 'Quick Tire Service',
        cost: 29.99,
      },
    ],
    trips: [
      { date: '2024-02-10', destination: 'New York', distance: '300 miles' },
      { date: '2024-02-05', destination: 'Boston', distance: '250 miles' },
    ],
  },
]
