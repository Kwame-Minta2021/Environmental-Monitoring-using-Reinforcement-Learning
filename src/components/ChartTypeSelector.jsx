import React from 'react';
import { ChartBarIcon, ChartLineIcon, ChartPieIcon, ChartScatterIcon } from '@heroicons/react/24/outline';

const ChartTypeSelector = ({ selectedType, onTypeChange }) => {
  const chartTypes = [
    { label: 'Line Chart', value: 'line', icon: ChartLineIcon },
    { label: 'Bar Chart', value: 'bar', icon: ChartBarIcon },
    { label: 'Pie Chart', value: 'pie', icon: ChartPieIcon },
    { label: 'Scatter Plot', value: 'scatter', icon: ChartScatterIcon }
  ];

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      {chartTypes.map((type) => {
        const Icon = type.icon;
        return (
          <button
            key={type.value}
            onClick={() => onTypeChange(type.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              selectedType === type.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{type.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ChartTypeSelector; 