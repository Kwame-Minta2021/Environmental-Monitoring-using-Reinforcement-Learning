import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';

const SensorCard = ({ sensor }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'bg-success-light dark:bg-success-dark text-success-DEFAULT';
      case 'warning':
        return 'bg-warning-light dark:bg-warning-dark text-warning-DEFAULT';
      case 'critical':
        return 'bg-danger-light dark:bg-danger-dark text-danger-DEFAULT';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    }
  };

  const getTrendIcon = (value) => {
    // This would normally compare with historical data
    return value > 10 ? (
      <ArrowUpIcon className="h-4 w-4 text-danger-DEFAULT" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 text-success-DEFAULT" />
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{sensor.icon}</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {sensor.name}
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            sensor.status
          )}`}
        >
          {sensor.status}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{sensor.type}</p>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {sensor.value}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {sensor.unit}
            </span>
            {getTrendIcon(sensor.value)}
          </div>
          {sensor.humidity && (
            <div className="mt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Humidity: {sensor.humidity}%
              </span>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Last updated: {format(new Date(), 'HH:mm:ss')}
        </div>
      </div>
    </div>
  );
};

export default SensorCard; 