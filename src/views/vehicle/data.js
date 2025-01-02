/* eslint-disable prettier/prettier */
export const vehicles = [
  {
    id: 'V001',
    make: 'Toyota',
    year: 2020,
    model: 'Camry',
    licenseNumber: 'ABC123',
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
  },
  {
    id: 'V002',
    make: 'Honda',
    year: 2021,
    model: 'Civic',
    licenseNumber: 'XYZ789',
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
  },
]
