/* eslint-disable prettier/prettier */
export const vehicles = [
  {
    id: 'V001',
    make: 'Toyota',
    year: 2020,
    model: 'Camry',
    licenseNumber: 'ABC123',
    category: 'truck',
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
      {
        tripId: 'trip-001',
        driver: 'D1',
        startLocation: 'Mumbai',
        endLocation: 'Pune',
        startDate: '2024-02-10',
        endDate: '2024-02-10',
        distance: 150, // miles
        duration: 2, // hours
        totalCost: 1000, // in currency units
        vehicle: 'MH12-XY1234',
        status: 'completed',
      },
      {
        tripId: 'trip-002',
        driver: 'D2',
        startLocation: 'Delhi',
        endLocation: 'Jaipur',
        startDate: '2024-02-12',
        endDate: '2024-02-12',
        distance: 170, // miles
        duration: 3, // hours
        totalCost: 1500, // in currency units
        vehicle: 'DL01-AB5678',
        status: 'completed',
      },
      {
        tripId: 'trip-003',
        driver: 'D1',
        startLocation: 'Bangalore',
        endLocation: 'Mysore',
        startDate: '2024-02-15',
        endDate: '2024-02-15',
        distance: 90, // miles
        duration: 1.5, // hours
        totalCost: 800, // in currency units
        vehicle: 'KA03-CD9012',
        status: 'cancelled',
      },
      {
        tripId: 'trip-004',
        driver: 'D3',
        startLocation: 'Chennai',
        endLocation: 'Coimbatore',
        startDate: '2024-02-18',
        endDate: '2024-02-18',
        distance: 310, // miles
        duration: 5, // hours
        totalCost: 2500, // in currency units
        vehicle: 'TN10-EF3456',
        status: 'in-progress',
      },
    ],
  },
  {
    id: 'V002',
    make: 'Honda',
    year: 2021,
    model: 'Civic',
    licenseNumber: 'XYZ789',
    category: 'car',
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
      {
        tripId: 'trip-001',
        driver: 'D4',
        startLocation: 'Hyderabad',
        endLocation: 'Vizag',
        startDate: '2024-02-20',
        endDate: '2024-02-20',
        distance: 380, // miles
        duration: 6, // hours
        totalCost: 3000, // in currency units
        vehicle: 'TS09-GH7890',
        status: 'completed',
      },
      {
        tripId: 'trip-002',
        driver: 'D2',
        startLocation: 'Ahmedabad',
        endLocation: 'Surat',
        startDate: '2024-02-22',
        endDate: '2024-02-22',
        distance: 160, // miles
        duration: 2.5, // hours
        totalCost: 1200, // in currency units
        vehicle: 'GJ05-IJ1234',
        status: 'completed',
      },
    ],
  },
  {
    id: 'V003',
    make: 'Honda',
    year: 2021,
    model: 'Civic',
    licenseNumber: 'XYZ789',
    category: 'taxi',
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
      {
        tripId: 'trip-001',
        driver: 'D4',
        startLocation: 'Hyderabad',
        endLocation: 'Vizag',
        startDate: '2024-02-20',
        endDate: '2024-02-20',
        distance: 380, // miles
        duration: 6, // hours
        totalCost: 3000, // in currency units
        vehicle: 'TS09-GH7890',
        status: 'completed',
      },
      {
        tripId: 'trip-002',
        driver: 'D2',
        startLocation: 'Ahmedabad',
        endLocation: 'Surat',
        startDate: '2024-02-22',
        endDate: '2024-02-22',
        distance: 160, // miles
        duration: 2.5, // hours
        totalCost: 1200, // in currency units
        vehicle: 'GJ05-IJ1234',
        status: 'completed',
      },
    ],
  },
  {
    id: 'V004',
    make: 'Honda',
    year: 2021,
    model: 'Civic',
    licenseNumber: 'XYZ789',
    category: 'bus',
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
      {
        tripId: 'trip-001',
        driver: 'D4',
        startLocation: 'Hyderabad',
        endLocation: 'Vizag',
        startDate: '2024-02-20',
        endDate: '2024-02-20',
        distance: 380, // miles
        duration: 6, // hours
        totalCost: 3000, // in currency units
        vehicle: 'TS09-GH7890',
        status: 'completed',
      },
      {
        tripId: 'trip-002',
        driver: 'D2',
        startLocation: 'Ahmedabad',
        endLocation: 'Surat',
        startDate: '2024-02-22',
        endDate: '2024-02-22',
        distance: 160, // miles
        duration: 2.5, // hours
        totalCost: 1200, // in currency units
        vehicle: 'GJ05-IJ1234',
        status: 'completed',
      },
    ],
  },
  {
    id: 'V005',
    make: 'Honda',
    year: 2021,
    model: 'Civic',
    licenseNumber: 'XYZ789',
    category: 'car',
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
      {
        tripId: 'trip-001',
        driver: 'D4',
        startLocation: 'Hyderabad',
        endLocation: 'Vizag',
        startDate: '2024-02-20',
        endDate: '2024-02-20',
        distance: 380, // miles
        duration: 6, // hours
        totalCost: 3000, // in currency units
        vehicle: 'TS09-GH7890',
        status: 'completed',
      },
      {
        tripId: 'trip-002',
        driver: 'D2',
        startLocation: 'Ahmedabad',
        endLocation: 'Surat',
        startDate: '2024-02-22',
        endDate: '2024-02-22',
        distance: 160, // miles
        duration: 2.5, // hours
        totalCost: 1200, // in currency units
        vehicle: 'GJ05-IJ1234',
        status: 'completed',
      },
    ],
  },
  {
    id: 'V006',
    make: 'Honda',
    year: 2021,
    model: 'Civic',
    licenseNumber: 'XYZ789',
    category: 'bus',
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
      {
        tripId: 'trip-001',
        driver: 'D4',
        startLocation: 'Hyderabad',
        endLocation: 'Vizag',
        startDate: '2024-02-20',
        endDate: '2024-02-20',
        distance: 380, // miles
        duration: 6, // hours
        totalCost: 3000, // in currency units
        vehicle: 'TS09-GH7890',
        status: 'completed',
      },
      {
        tripId: 'trip-002',
        driver: 'D2',
        startLocation: 'Ahmedabad',
        endLocation: 'Surat',
        startDate: '2024-02-22',
        endDate: '2024-02-22',
        distance: 160, // miles
        duration: 2.5, // hours
        totalCost: 1200, // in currency units
        vehicle: 'GJ05-IJ1234',
        status: 'completed',
      },
    ],
  },
  {
    id: 'V007',
    make: 'Honda',
    year: 2021,
    model: 'Civic',
    licenseNumber: 'XYZ789',
    category: 'truck',
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
      {
        tripId: 'trip-001',
        driver: 'D4',
        startLocation: 'Hyderabad',
        endLocation: 'Vizag',
        startDate: '2024-02-20',
        endDate: '2024-02-20',
        distance: 380, // miles
        duration: 6, // hours
        totalCost: 3000, // in currency units
        vehicle: 'TS09-GH7890',
        status: 'completed',
      },
      {
        tripId: 'trip-002',
        driver: 'D2',
        startLocation: 'Ahmedabad',
        endLocation: 'Surat',
        startDate: '2024-02-22',
        endDate: '2024-02-22',
        distance: 160, // miles
        duration: 2.5, // hours
        totalCost: 1200, // in currency units
        vehicle: 'GJ05-IJ1234',
        status: 'completed',
      },
    ],
  },
  {
    id: 'V008',
    make: 'Honda',
    year: 2021,
    model: 'Civic',
    licenseNumber: 'XYZ789',
    category: 'truck',
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
      {
        tripId: 'trip-001',
        driver: 'D4',
        startLocation: 'Hyderabad',
        endLocation: 'Vizag',
        startDate: '2024-02-20',
        endDate: '2024-02-20',
        distance: 380, // miles
        duration: 6, // hours
        totalCost: 3000, // in currency units
        vehicle: 'TS09-GH7890',
        status: 'completed',
      },
      {
        tripId: 'trip-002',
        driver: 'D2',
        startLocation: 'Ahmedabad',
        endLocation: 'Surat',
        startDate: '2024-02-22',
        endDate: '2024-02-22',
        distance: 160, // miles
        duration: 2.5, // hours
        totalCost: 1200, // in currency units
        vehicle: 'GJ05-IJ1234',
        status: 'completed',
      },
    ],
  },
  {
    id: 'V009',
    make: 'Honda',
    year: 2021,
    model: 'Civic',
    licenseNumber: 'XYZ789',
    category: 'car',
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
      {
        tripId: 'trip-001',
        driver: 'D4',
        startLocation: 'Hyderabad',
        endLocation: 'Vizag',
        startDate: '2024-02-20',
        endDate: '2024-02-20',
        distance: 380, // miles
        duration: 6, // hours
        totalCost: 3000, // in currency units
        vehicle: 'TS09-GH7890',
        status: 'completed',
      },
      {
        tripId: 'trip-002',
        driver: 'D2',
        startLocation: 'Ahmedabad',
        endLocation: 'Surat',
        startDate: '2024-02-22',
        endDate: '2024-02-22',
        distance: 160, // miles
        duration: 2.5, // hours
        totalCost: 1200, // in currency units
        vehicle: 'GJ05-IJ1234',
        status: 'completed',
      },
    ],
  },
  {
    id: 'V0010',
    make: 'Honda',
    year: 2021,
    model: 'Civic',
    licenseNumber: 'XYZ789',
    category: 'car',
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
      {
        tripId: 'trip-001',
        driver: 'D4',
        startLocation: 'Hyderabad',
        endLocation: 'Vizag',
        startDate: '2024-02-20',
        endDate: '2024-02-20',
        distance: 380, // miles
        duration: 6, // hours
        totalCost: 3000, // in currency units
        vehicle: 'TS09-GH7890',
        status: 'completed',
      },
      {
        tripId: 'trip-002',
        driver: 'D2',
        startLocation: 'Ahmedabad',
        endLocation: 'Surat',
        startDate: '2024-02-22',
        endDate: '2024-02-22',
        distance: 160, // miles
        duration: 2.5, // hours
        totalCost: 1200, // in currency units
        vehicle: 'GJ05-IJ1234',
        status: 'completed',
      },
    ],
  },
  {
    id: 'V0011',
    make: 'Honda',
    year: 2021,
    model: 'Civic',
    licenseNumber: 'XYZ789',
    category: 'car',
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
      {
        tripId: 'trip-001',
        driver: 'D4',
        startLocation: 'Hyderabad',
        endLocation: 'Vizag',
        startDate: '2024-02-20',
        endDate: '2024-02-20',
        distance: 380, // miles
        duration: 6, // hours
        totalCost: 3000, // in currency units
        vehicle: 'TS09-GH7890',
        status: 'completed',
      },
      {
        tripId: 'trip-002',
        driver: 'D2',
        startLocation: 'Ahmedabad',
        endLocation: 'Surat',
        startDate: '2024-02-22',
        endDate: '2024-02-22',
        distance: 160, // miles
        duration: 2.5, // hours
        totalCost: 1200, // in currency units
        vehicle: 'GJ05-IJ1234',
        status: 'completed',
      },
    ],
  },
  {
    id: 'V0012',
    make: 'Honda',
    year: 2021,
    model: 'Civic',
    licenseNumber: 'XYZ789',
    category: 'car',
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
      {
        tripId: 'trip-001',
        driver: 'D4',
        startLocation: 'Hyderabad',
        endLocation: 'Vizag',
        startDate: '2024-02-20',
        endDate: '2024-02-20',
        distance: 380, // miles
        duration: 6, // hours
        totalCost: 3000, // in currency units
        vehicle: 'TS09-GH7890',
        status: 'completed',
      },
      {
        tripId: 'trip-002',
        driver: 'D2',
        startLocation: 'Ahmedabad',
        endLocation: 'Surat',
        startDate: '2024-02-22',
        endDate: '2024-02-22',
        distance: 160, // miles
        duration: 2.5, // hours
        totalCost: 1200, // in currency units
        vehicle: 'GJ05-IJ1234',
        status: 'completed',
      },
    ],
  },
  {
    id: 'V0013',
    make: 'Honda',
    year: 2021,
    model: 'Civic',
    licenseNumber: 'XYZ789',
    category: 'car',
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
      {
        tripId: 'trip-001',
        driver: 'D4',
        startLocation: 'Hyderabad',
        endLocation: 'Vizag',
        startDate: '2024-02-20',
        endDate: '2024-02-20',
        distance: 380, // miles
        duration: 6, // hours
        totalCost: 3000, // in currency units
        vehicle: 'TS09-GH7890',
        status: 'completed',
      },
      {
        tripId: 'trip-002',
        driver: 'D2',
        startLocation: 'Ahmedabad',
        endLocation: 'Surat',
        startDate: '2024-02-22',
        endDate: '2024-02-22',
        distance: 160, // miles
        duration: 2.5, // hours
        totalCost: 1200, // in currency units
        vehicle: 'GJ05-IJ1234',
        status: 'completed',
      },
    ],
  },
  {
    id: 'V0014',
    make: 'Honda',
    year: 2021,
    model: 'Civic',
    licenseNumber: 'XYZ789',
    category: 'car',
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
      {
        tripId: 'trip-001',
        driver: 'D4',
        startLocation: 'Hyderabad',
        endLocation: 'Vizag',
        startDate: '2024-02-20',
        endDate: '2024-02-20',
        distance: 380, // miles
        duration: 6, // hours
        totalCost: 3000, // in currency units
        vehicle: 'TS09-GH7890',
        status: 'completed',
      },
      {
        tripId: 'trip-002',
        driver: 'D2',
        startLocation: 'Ahmedabad',
        endLocation: 'Surat',
        startDate: '2024-02-22',
        endDate: '2024-02-22',
        distance: 160, // miles
        duration: 2.5, // hours
        totalCost: 1200, // in currency units
        vehicle: 'GJ05-IJ1234',
        status: 'completed',
      },
    ],
  },
  {
    id: 'V0015',
    make: 'Honda',
    year: 2021,
    model: 'Civic',
    licenseNumber: 'XYZ789',
    category: 'car',
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
      {
        tripId: 'trip-001',
        driver: 'D4',
        startLocation: 'Hyderabad',
        endLocation: 'Vizag',
        startDate: '2024-02-20',
        endDate: '2024-02-20',
        distance: 380, // miles
        duration: 6, // hours
        totalCost: 3000, // in currency units
        vehicle: 'TS09-GH7890',
        status: 'completed',
      },
      {
        tripId: 'trip-002',
        driver: 'D2',
        startLocation: 'Ahmedabad',
        endLocation: 'Surat',
        startDate: '2024-02-22',
        endDate: '2024-02-22',
        distance: 160, // miles
        duration: 2.5, // hours
        totalCost: 1200, // in currency units
        vehicle: 'GJ05-IJ1234',
        status: 'completed',
      },
    ],
  },
]
