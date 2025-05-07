import React, { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import './BudgetAllocationChart.css'

const COLORS = [
  '#4e73df',
  '#1cc88a',
  '#36b9cc',
  '#f6c23e',
  '#e74a3b',
  '#858796',
  '#fd7e14',
  '#20c997',
]

const BudgetAllocationChart = ({ subTrips }) => {
  const [isBarChart, setIsBarChart] = useState(true)

  const data = subTrips.map((trip) => ({
    route: `${trip.startLocation} → ${trip.endLocation}`,
    budget: trip.budgetAllocated,
  }))

  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0)

  return (
    <div className="budget-chart-container">
      <div className="chart-header">
        <h3 className="chartil-title">Budget Allocation per Route</h3>
        {subTrips.length > 0 && (
          <button className="toggle-chart-button" onClick={() => setIsBarChart(!isBarChart)}>
            {isBarChart ? 'Pie' : 'Bar'}
          </button>
        )}
      </div>

      {/* Total Budget Display */}
      {subTrips.length > 0 && (
        <div className="total-budget">
          <strong>Total Budget:</strong> ₹{totalBudget.toLocaleString()}
        </div>
      )}

      {subTrips.length === 0 ? (
        <div className="text-center text-muted" style={{ padding: '80px 0', fontSize: '18px' }}>
          No Budgets data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          {isBarChart ? (
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="route"
                tick={{ fontSize: 6 }}
                interval={0}
                angle={-30}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Allocated']}
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '13px',
                }}
                labelStyle={{ color: '#333', fontWeight: 500 }}
              />
              <Bar dataKey="budget" fill="#4e73df" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                dataKey="budget"
                nameKey="route"
                outerRadius="60%"
                label={({ name }) => `${name}`}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`₹${value.toLocaleString()} : ${name}`]}
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '13px',
                }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default BudgetAllocationChart
