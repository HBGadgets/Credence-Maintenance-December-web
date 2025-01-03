// Sample React.js Component for Purchasing New Parts
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PurchaseNewParts = () => {
  const [formData, setFormData] = useState({
    partName: '',
    category: '',
    vendor: '',
    quantity: 1,
    costPerUnit: 0,
    purchaseDate: '',
    invoiceNumber: '',
  });

  const [message, setMessage] = useState('');
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  useEffect(() => {
    // Fetch existing purchases when the component loads
    const fetchPurchaseHistory = async () => {
      try {
        const response = await axios.get('/api/purchases');
        setPurchaseHistory(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching purchase history:', error);
        setPurchaseHistory([]);
      }
    };

    fetchPurchaseHistory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/purchases', formData);
      if (response.status === 200) {
        setMessage('Purchase successfully recorded!');
        setFormData({
          partName: '',
          category: '',
          vendor: '',
          quantity: 1,
          costPerUnit: 0,
          purchaseDate: '',
          invoiceNumber: '',
        });
        setPurchaseHistory((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Error saving purchase:', error);
      setMessage('Error recording purchase. Please try again.');
    }
  };

  return (
    <div className="purchase-form">
      <h2>Purchase New Parts</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Part Name:
          <input
            type="text"
            name="partName"
            value={formData.partName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Category:
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Vendor:
          <input
            type="text"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Quantity:
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
          />
        </label>
        <label>
          Cost Per Unit:
          <input
            type="number"
            name="costPerUnit"
            value={formData.costPerUnit}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </label>
        <label>
          Purchase Date:
          <input
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Invoice Number:
          <input
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      <h2>Purchase History</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Part Name</th>
            <th>Category</th>
            <th>Vendor</th>
            <th>Quantity</th>
            <th>Cost Per Unit</th>
            <th>Total Cost</th>
            <th>Purchase Date</th>
            <th>Invoice Number</th>
          </tr>
        </thead>
        <tbody>
          {purchaseHistory.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>
                No purchase records available.
              </td>
            </tr>
          ) : (
            purchaseHistory.map((purchase, index) => (
              <tr key={index}>
                <td>{purchase.partName}</td>
                <td>{purchase.category}</td>
                <td>{purchase.vendor}</td>
                <td>{purchase.quantity}</td>
                <td>{purchase.costPerUnit}</td>
                <td>{purchase.quantity * purchase.costPerUnit}</td>
                <td>{purchase.purchaseDate}</td>
                <td>{purchase.invoiceNumber}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseNewParts;
