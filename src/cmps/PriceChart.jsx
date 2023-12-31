import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  RadialLinearScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Doughnut, Line, PolarArea } from 'react-chartjs-2'
ChartJS.register(CategoryScale, RadialLinearScale, ArcElement, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export function PriceChart() {
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Toys Prices',
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.formattedValue}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
    },
  }
  const labels = ['2000', '2005', '2008', '2013', '2017', '2020', '2021', '2022', '2023']

  const generateRandomData = () => {
    return labels.map(() => Math.floor(Math.random() * 20 + 5))
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Prices',
        data: generateRandomData(),
        borderColor: 'rgb(65, 65, 209)',
        backgroundColor: 'rgba(65, 65, 209)',
      },
    ],
  }

  return (
    <section className='line-chart-container'>
      <Line options={options} data={data} />
    </section>
  )
}
