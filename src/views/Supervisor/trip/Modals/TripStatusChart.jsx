import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const TripStatusChart = ({ subTrips }) => {
  const statusCounts = subTrips.reduce((acc, trip) => {
    acc[trip.status] = (acc[trip.status] || 0) + 1
    return acc
  }, {})

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <h3 style={{ marginBottom: '8px', color: '#333' }}>Trip Status Distribution</h3>
      <p style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        This chart shows the distribution of all subtrips based on their current status such as
        'Completed', 'In Progress', or 'Pending'.
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={70}
            fill="#8884d8"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} trip(s)`, name]}
            contentStyle={{
              backgroundColor: '#fff',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '13px',
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TripStatusChart
