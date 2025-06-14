import React, { useState } from 'react'
import { Line } from 'react-chartjs-2'
import { ButtonGroup, Button } from 'react-bootstrap'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

const FuelAnalayis = () => {
  const [selectedTrend, setSelectedTrend] = useState('efficiency')

  const trendLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']

  const trendData = {
    efficiency: [8.1, 8.3, 8.0, 8.2],
    consumption: [290, 310, 280, 300],
    expenses: [3700, 3800, 3600, 3900],
  }

  const chartConfig = {
    labels: trendLabels,
    datasets: [
      {
        label:
          selectedTrend === 'efficiency'
            ? 'Fuel Efficiency (km/L)'
            : selectedTrend === 'consumption'
              ? 'Fuel Consumption (L)'
              : 'Fuel Expenses (₹)',
        data: trendData[selectedTrend],
        fill: false,
        borderColor:
          selectedTrend === 'efficiency'
            ? '#0d6efd'
            : selectedTrend === 'consumption'
              ? '#fd7e14'
              : '#dc3545',
        tension: 0.3,
        pointBackgroundColor: 'white',
        pointBorderColor: '#000',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
          },
        },
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
      },
    },
    scales: {
      y: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  }

  return (
    <div className="mt-4 p-3 border rounded bg-light shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          Monthly Analytics{' '}
          <small className="text-muted">
            for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </small>
        </h5>

        <ButtonGroup>
          <Button
            variant={selectedTrend === 'efficiency' ? 'primary' : 'outline-primary'}
            onClick={() => setSelectedTrend('efficiency')}
          >
            Fuel Efficiency Trend
          </Button>
          <Button
            variant={selectedTrend === 'consumption' ? 'warning' : 'outline-warning'}
            onClick={() => setSelectedTrend('consumption')}
          >
            Fuel Consumption Trend
          </Button>
          <Button
            variant={selectedTrend === 'expenses' ? 'danger' : 'outline-danger'}
            onClick={() => setSelectedTrend('expenses')}
          >
            Fuel Expenses Trend
          </Button>
        </ButtonGroup>
      </div>

      {/* Chart container with fixed height */}
      <div style={{ height: '250px' }}>
        <Line data={chartConfig} options={options} />
      </div>
    </div>
  )
}

export default FuelAnalayis
