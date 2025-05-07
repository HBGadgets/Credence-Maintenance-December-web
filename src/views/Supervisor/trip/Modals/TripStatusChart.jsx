// import React from 'react'
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// const TripStatusChart = ({ subTrips }) => {
//   const statusCounts = subTrips.reduce((acc, trip) => {
//     acc[trip.status] = (acc[trip.status] || 0) + 1
//     return acc
//   }, {})

//   const data = Object.entries(statusCounts).map(([status, count]) => ({
//     name: status,
//     value: count,
//   }))

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

//   return (
//     <div style={{ width: '100%', height: 300 }}>
//       <h3>Trip Status Distribution</h3>
//       <ResponsiveContainer>
//         <PieChart>
//           <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" label>
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// export default TripStatusChart

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import './TripStatusChart.css'

const COLORS = ['#008CFF', '#00C49F', '#FFBB28', '#FF8042', '#AA66CC', '#FF6B6B', '#4BC0C0']

const TripStatusChart = ({ subTrips }) => {
  const data = subTrips.map((trip) => ({
    name: `${trip.startLocation} → ${trip.endLocation}`,
    value: trip.budgetAllocated,
  }))

  const totalBudget = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="trip-chart-wrapper">
      <h3 className="chartol-header">Trip Budget Allocation</h3>

      {subTrips.length === 0 ? (
        <div className="text-center text-muted" style={{ padding: '90px 0', fontSize: '18px' }}>
          No Trip Budget data available
        </div>
      ) : (
        <div className="trip-chart-content">
          <div className="donut-container">
            <ResponsiveContainer width={250} height={250}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`₹${value.toLocaleString()}`, name]}
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="donut-center-text">
              ₹{totalBudget.toLocaleString()}
              <div className="center-label">Total</div>
            </div>
          </div>

          <div className="trip-legend">
            <ul>
              {data.map((entry, index) => (
                <li key={index}>
                  <span
                    className="legend-color-box"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="legend-label">{entry.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default TripStatusChart
