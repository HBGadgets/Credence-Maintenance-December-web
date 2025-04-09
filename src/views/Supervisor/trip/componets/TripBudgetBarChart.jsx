import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts'

const TripBudgetBarChart = ({ budget = 0, spent = 0 }) => {
  const utilizationRate = budget ? ((spent / budget) * 100).toFixed(1) : 0
  const efficiency = spent ? ((budget / spent) * 100).toFixed(1) : 0

  const data = [
    {
      name: 'Budget Utilization',
      Budget: budget,
      Spent: spent,
    },
  ]

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h5 className="card-title mb-4">Budget Analysis</h5>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(val) => `₹${val.toLocaleString()}`} />
            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
            <Legend
              formatter={(value) =>
                value === 'Budget'
                  ? `Budget Allocated (100%)`
                  : `Spent Amount (${utilizationRate}%)`
              }
            />
            <Bar dataKey="Budget" fill="#90caf9" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="Budget"
                position="top"
                formatter={(val) => `₹${val.toLocaleString()}`}
              />
            </Bar>
            <Bar dataKey="Spent" fill="#007bff" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="Spent"
                position="top"
                formatter={(val) => `₹${val.toLocaleString()}`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="d-flex justify-content-center gap-4 mt-4 flex-wrap">
          <div
            className="p-3 rounded text-center"
            style={{ backgroundColor: '#f0f8ff', minWidth: 180 }}
          >
            <div className="text-muted">Utilization Rate</div>
            <div className="fw-bold fs-5 text-primary">{utilizationRate}%</div>
          </div>
          <div
            className="p-3 rounded text-center"
            style={{ backgroundColor: '#e6fff5', minWidth: 180 }}
          >
            <div className="text-muted">Budget Efficiency</div>
            <div className="fw-bold fs-5 text-success">{efficiency}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripBudgetBarChart
