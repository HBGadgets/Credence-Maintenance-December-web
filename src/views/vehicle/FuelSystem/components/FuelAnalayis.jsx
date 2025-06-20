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

const FuelAnalayis = ({ records = [] }) => {
  const [selectedTrend, setSelectedTrend] = useState('consumption')

  // Sort records by date (ascending)
  const sortedRecords = [...records].sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split('-')
    const [dayB, monthB, yearB] = b.date.split('-')
    const dateA = new Date(`${yearA}-${monthA}-${dayA}`)
    const dateB = new Date(`${yearB}-${monthB}-${dayB}`)
    return dateA - dateB
  })

  const labels = sortedRecords.map((rec) => rec.date)
  const consumptionData = sortedRecords.map((rec) => rec.dailyFuelConsumption || 0)
  const expenseData = sortedRecords.map(
    (rec) => rec.fuelExpenses?.reduce((sum, f) => sum + f.amount, 0) || 0,
  )
  const distanceData = sortedRecords.map((rec) => rec.distance || 0)

  const getLabel = () => {
    if (selectedTrend === 'consumption') return 'Fuel Consumption (L)'
    if (selectedTrend === 'expenses') return 'Fuel Expenses (₹)'
    if (selectedTrend === 'distance') return 'Distance Travelled (KM)'
  }

  const getColor = () => {
    if (selectedTrend === 'consumption') return '#0d6efd'
    if (selectedTrend === 'expenses') return '#dc3545'
    if (selectedTrend === 'distance') return '#20c997'
  }

  const chartConfig = {
    labels,
    datasets: [
      {
        label: getLabel(),
        data:
          selectedTrend === 'consumption'
            ? consumptionData
            : selectedTrend === 'expenses'
              ? expenseData
              : distanceData,
        fill: false,
        borderColor: getColor(),
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
          font: { size: 12 },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    layout: {
      padding: { top: 10, bottom: 10 },
    },
    scales: {
      y: {
        ticks: { font: { size: 12 } },
        title: {
          display: true,
          text:
            selectedTrend === 'consumption'
              ? 'Liters'
              : selectedTrend === 'expenses'
                ? 'Rupees'
                : 'Kilometers',
        },
      },
      x: {
        ticks: { font: { size: 12 } },
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  }

  return (
    <div className="mt-4 p-3 border rounded bg-light shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          Daily Analytics{' '}
          <small className="text-muted">
            for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </small>
        </h5>

        <ButtonGroup>
          <Button
            variant={selectedTrend === 'consumption' ? 'primary' : 'outline-primary'}
            onClick={() => setSelectedTrend('consumption')}
          >
            Fuel Consumption
          </Button>
          <Button
            variant={selectedTrend === 'expenses' ? 'danger' : 'outline-danger'}
            onClick={() => setSelectedTrend('expenses')}
          >
            Fuel Expenses
          </Button>
          <Button
            variant={selectedTrend === 'distance' ? 'success' : 'outline-success'}
            onClick={() => setSelectedTrend('distance')}
          >
            Daily KM Travel
          </Button>
        </ButtonGroup>
      </div>

      <div style={{ height: '250px' }}>
        <Line data={chartConfig} options={options} />
      </div>
    </div>
  )
}

export default FuelAnalayis
