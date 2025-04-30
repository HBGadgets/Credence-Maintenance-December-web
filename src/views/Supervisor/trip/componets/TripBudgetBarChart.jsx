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
    <div className=" shadow-sm border-0">
      <div className="card-body">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(val) => `₹${val.toLocaleString()}`} />
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString()}`}
              labelFormatter={(label) => label}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                color: 'black',
              }}
              labelStyle={{ color: 'black' }}
              itemStyle={{ color: 'black' }}
            />

            <Legend
              formatter={(value) => {
                const isSpent = value === 'Spent'
                const label = isSpent
                  ? `Spent Amount (${utilizationRate}%)`
                  : `Budget Allocated (100%)`

                // Force black text for both
                return <span style={{ color: 'black', fontWeight: 500 }}>{label}</span>
              }}
            />

            <Bar dataKey="Budget" fill="#90caf9" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="Budget"
                position="top"
                formatter={(val) => `₹${val.toLocaleString()}`}
              />
            </Bar>
            <Bar dataKey="Spent" fill="#E9DCC9" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="Spent"
                position="top"
                formatter={(val) => `₹${val.toLocaleString()}`}
                fill="black" // 👈 This sets the text color to black
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
