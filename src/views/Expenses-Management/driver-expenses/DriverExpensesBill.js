import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DriverExpenses = ({ driverId }) => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    date: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/expenses/${driverId}`);
      console.log('API Response:', response.data); // Debugging API Response
      setExpenses(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch expenses.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    try {
      await axios.post('/api/expenses', { ...newExpense, driverId });
      fetchExpenses(); // Reload expenses after adding new one
      setNewExpense({ category: '', amount: '', date: '', description: '' });
      setError(null); // Clear errors on success
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add expense.');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await axios.delete(`/api/expenses/${expenseId}`);
      fetchExpenses(); // Reload expenses after deleting
      setError(null); // Clear errors on success
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete expense.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Driver Expenses</h2>
      {loading && <div>Loading expenses...</div>}
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddExpense();
        }}
        style={{ marginBottom: '20px' }}
      >
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Category"
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            style={{ marginRight: '10px' }}
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            style={{ marginRight: '10px' }}
            required
          />
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            style={{ marginRight: '10px' }}
            required
          />
        </div>
        <textarea
          placeholder="Description"
          value={newExpense.description}
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Add Expense
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Amount</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(expenses) && expenses.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '10px' }}>
                No expenses recorded for this driver.
              </td>
            </tr>
          ) : (
            expenses.map((expense) => (
              <tr key={expense._id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{expense.date}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{expense.category}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{expense.amount}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{expense.description}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => handleDeleteExpense(expense._id)}
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DriverExpenses;
