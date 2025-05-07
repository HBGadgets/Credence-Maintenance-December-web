import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './MaterialAnalysisChart.css' // Optional CSS styling

const MaterialAnalysisChart = ({ subTrips }) => {
  // Count materials from all sub-trips
  const materialCounts = subTrips.reduce((acc, trip) => {
    const materials = trip.materialType ? trip.materialType.split(',').map((m) => m.trim()) : []
    materials.forEach((material) => {
      acc[material] = (acc[material] || 0) + 1
    })
    return acc
  }, {})

  // Convert counts to chart data format
  const data = Object.entries(materialCounts).map(([material, count]) => ({
    name: material,
    value: count,
  }))

  console.log('dataaa', data)

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#33AA99']

  return (
    <div className="material-chart-container">
      <h3 className="chartile-title">Material Usage Analysis</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              nameKey="name"
              dataKey="value"
              outerRadius={100}
              innerRadius={70}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-muted" style={{ padding: '100px 0', fontSize: '18px' }}>
          No material data available.
        </p>
      )}
    </div>
  )
}

export default MaterialAnalysisChart
