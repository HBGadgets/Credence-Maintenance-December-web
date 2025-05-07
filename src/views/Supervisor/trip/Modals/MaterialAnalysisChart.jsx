import React, { useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import './MaterialAnalysisChart.css'

const MaterialAnalysisChart = ({ subTrips }) => {
  const [chartType, setChartType] = useState('pie')

  const materialCounts = subTrips.reduce((acc, trip) => {
    const materials = trip.materialType ? trip.materialType.split(',').map((m) => m.trim()) : []
    materials.forEach((material) => {
      acc[material] = (acc[material] || 0) + 1
    })
    return acc
  }, {})

  const data = Object.entries(materialCounts).map(([material, count]) => ({
    name: material,
    value: count,
  }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#33AA99']

  const toggleChart = () => {
    setChartType((prev) => (prev === 'pie' ? 'bar' : 'pie'))
  }

  return (
    <div className="material-chartitles-container">
      <div className="chartitles-title-header">
        <h3 className="chartitles-title">Material Usage Analysis</h3>
        <button onClick={toggleChart} className="toggle-chartitles-btn">
          {chartType === 'pie' ? 'Switch to Bar Chart' : 'Switch to Pie Chart'}
        </button>
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                nameKey="name"
                dataKey="value"
                outerRadius={110}
                innerRadius={70}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#007bff" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      ) : (
        <p className="no-data-text">No material data available.</p>
      )}
    </div>
  )
}

export default MaterialAnalysisChart
