import React from 'react';
import faker from 'faker';
import { Bar } from 'react-chartjs-2';
import { previousDate } from '../utils/demos';

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};

const labels = Array.from({ length: 10 }, (_, i) => previousDate(10 - i));

export const data = {
  labels,
  datasets: [
    {
      label: 'Expected session',
      data: labels.map(() => faker.random.number({ min: 0, max: 1000 })),
      backgroundColor: 'rgba(55, 102, 110, 0.75)',
    },
    {
      label: 'Actual session',
      data: labels.map(() => faker.random.number({ min: 0, max: 1000 })),
      backgroundColor: 'rgba(150, 184, 61, 0.75)',
    },
  ],
};

const PatientMedicationChart = () => {
  return <Bar options={options} data={data} />;
};

export default PatientMedicationChart;
