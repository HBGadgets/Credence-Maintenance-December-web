import PropTypes from 'prop-types';

// Define the Expense data structure
export const ExpensePropType = {
    id: PropTypes.string.isRequired,
    driverId: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    vehicleName: PropTypes.string.isRequired,
    expenseType: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    paymentType: PropTypes.string.isRequired,
    billImage: PropTypes.string.isRequired,
};

// Sample expenses data
export const expenses = [
    // Driver 1
    {
        id: '1',
        driverId: '1',
        date: '2024-03-10',
        vehicleName: 'TN 01 AB 1234',
        expenseType: 'Fuel',
        amount: 5000,
        paymentType: 'Cash',
        billImage: 'https://images.unsplash.com/photo-1572314493295-09c6d5ec3cdf?w=400',
    },
    {
        id: '2',
        driverId: '1',
        date: '2024-03-11',
        vehicleName: 'TN 01 AB 1234',
        expenseType: 'Maintenance',
        amount: 2000,
        paymentType: 'UPI',
        billImage: 'https://images.unsplash.com/photo-1554774853-719586f82d77?w=400',
    },
    // Driver 2
    {
        id: '3',
        driverId: '2',
        date: '2024-03-10',
        vehicleName: 'TN 01 CD 5678',
        expenseType: 'Fuel',
        amount: 4500,
        paymentType: 'Card',
        billImage: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400',
    },
    {
        id: '4',
        driverId: '2',
        date: '2024-03-11',
        vehicleName: 'TN 01 CD 5678',
        expenseType: 'Toll',
        amount: 500,
        paymentType: 'FASTag',
        billImage: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=400',
    },
    // Driver 3
    {
        id: '5',
        driverId: '3',
        date: '2024-03-10',
        vehicleName: 'TN 01 EF 9012',
        expenseType: 'Fuel',
        amount: 4800,
        paymentType: 'Cash',
        billImage: 'https://images.unsplash.com/photo-1554774853-b415df9eeb92?w=400',
    },
    // Driver 4
    {
        id: '6',
        driverId: '4',
        date: '2024-03-11',
        vehicleName: 'TN 01 GH 3456',
        expenseType: 'Maintenance',
        amount: 3000,
        paymentType: 'UPI',
        billImage: 'https://images.unsplash.com/photo-1554774853-d50f9c681ae2?w=400',
    },
    // Driver 5
    {
        id: '7',
        driverId: '5',
        date: '2024-03-12',
        vehicleName: 'TN 01 IJ 7890',
        expenseType: 'Fuel',
        amount: 5200,
        paymentType: 'Card',
        billImage: 'https://images.unsplash.com/photo-1554774853-7263f8998473?w=400',
    },
];
