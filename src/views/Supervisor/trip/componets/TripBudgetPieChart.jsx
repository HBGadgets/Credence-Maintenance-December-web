import React from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

const TripBudgetPieChart = ({ budget = 0, spent = 0 }) => {
  const remaining = Math.max(budget - spent, 0)
  const total = spent + remaining
  const budgetRatio = budget > 0 ? (spent / budget).toFixed(2) : '0.00'

  const data = [
    {
      name: `Spent (${((spent / total) * 100).toFixed(1)}%)`,
      value: spent,
    },
    {
      name: `Remaining (${((remaining / total) * 100).toFixed(1)}%)`,
      value: remaining,
    },
  ]

  const COLORS = ['#007bff', '#E9DCC9'] // Blue & light gray

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body text-center">
        <h5 className="card-title mb-3">Budget Overview</h5>
        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={50}
              outerRadius={70}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="square"
              content={({ payload }) => (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    marginTop: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  {payload.map((entry, index) => (
                    <div
                      key={`legend-item-${index}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#000',
                        fontWeight: 500,
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor: entry.color,
                          marginRight: 8,
                          borderRadius: 2,
                        }}
                      ></div>
                      <span>{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
            />

            <Tooltip formatter={(value) => `₹${value}`} />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-3">
          <p className="mb-1">
            <strong>Budget Ratio:</strong> {budgetRatio}
          </p>
          <p className="mb-0">
            <strong>Remaining:</strong> ₹{remaining.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default TripBudgetPieChart
