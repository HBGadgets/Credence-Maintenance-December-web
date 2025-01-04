import React, { useState, useEffect } from 'react';
// import axios from 'axios';

const ExpenseForm = ({ onExpensesUpdate }) => {
    const [formData, setFormData] = useState({
        vehicleId: '', // Added vehicleId for the selected vehicle
        category: '',
        amount: '',
        vendor: '',
        receipt: null,
    });
    const [vehicles, setVehicles] = useState([]); // To store vehicle data

    // Fetch vehicles from the database
    // useEffect(() => {
    //     const fetchVehicles = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:5000/vehicles'); // Assuming this is your route for fetching vehicles
    //             setVehicles(response.data); // Save the fetched vehicles to state
    //         } catch (error) {
    //             alert('Error fetching vehicles: ' + error.message);
    //         }
    //     };
    //     // const fetchVehicles = async () => {
    //     //     const mockVehicles = [
    //     //         { _id: '1', licensePlate: 'ABC123', model: 'Toyota Camry' },
    //     //         { _id: '2', licensePlate: 'XYZ456', model: 'Ford F-150' },
    //     //         { _id: '3', licensePlate: 'LMN789', model: 'Chevrolet Silverado' }
    //     //     ];
    //     //     setVehicles(mockVehicles)
    //     // }

    //     fetchVehicles();
    // }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, receipt: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('vehicleId', formData.vehicleId); // Include vehicleId
        data.append('category', formData.category);
        data.append('amount', formData.amount);
        data.append('vendor', formData.vendor);
        // data.append('receipt', formData.receipt); // If you decide to include receipt

        // try {
        //     const response = await axios.post('http://localhost:5000/expenses', data);
        //     alert('Expense logged successfully!');
        //     onExpensesUpdate((prevExpenses) => [...prevExpenses, response.data]);
        // } catch (error) {
        //     alert('Error logging expense: ' + error.message);
        // }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Select Vehicle */}
            <label>
                Vehicle:
                <select name="vehicleId" value={formData.vehicleId} onChange={handleChange} >
                    <option value="">Select Vehicle</option>
                    {vehicles.map((vehicle) => (
                        <option key={vehicle._id} value={vehicle._id}>
                            {/* {vehicle.licensePlate} - {vehicle.model} */}
                            {vehicle.name}
                        </option>
                    ))}
                </select>
            </label>

            {/* Category */}
            <label>
                Category:
                <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Tolls">Tolls</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Licensing">Licensing</option>
                    <option value="Parts">Parts</option>
                    <option value="Accident">Accident</option>
                </select>
            </label>

            {/* Amount */}
            <label>
                Amount:
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
            </label>

            {/* Vendor */}
            <label>
                Vendor:
                <input type="text" name="vendor" value={formData.vendor} onChange={handleChange} />
            </label>

            {/* Receipt (Optional) */}
            <label>
                Receipt:
                <input type="file" onChange={handleFileChange} />
            </label>

            <button type="submit">Submit</button>
        </form>
    );
};

export default ExpenseForm;
