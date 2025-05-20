import React from 'react';
import { format, subDays, subHours } from 'date-fns';

const TimeRangeSelector = ({ selectedRange, onRangeChange, onCustomRangeChange }) => {
  const ranges = [
    { label: 'Live', value: 'live' },
    { label: '24 Hours', value: '24h' },
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: 'Custom', value: 'custom' }
  ];

  const getDateRange = (range) => {
    const now = new Date();
    switch (range) {
      case '24h':
        return {
          start: subHours(now, 24),
          end: now
        };
      case '7d':
        return {
          start: subDays(now, 7),
          end: now
        };
      case '30d':
        return {
          start: subDays(now, 30),
          end: now
        };
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex flex-wrap gap-2">
        {ranges.map((range) => (
          <button
            key={range.value}
            onClick={() => {
              onRangeChange(range.value);
              if (range.value !== 'custom') {
                const dateRange = getDateRange(range.value);
                onCustomRangeChange(dateRange);
              }
            }}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              selectedRange === range.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {selectedRange === 'custom' && (
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="datetime-local"
              onChange={(e) => {
                const start = new Date(e.target.value);
                onCustomRangeChange({ start, end: new Date() });
              }}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="datetime-local"
              onChange={(e) => {
                const end = new Date(e.target.value);
                onCustomRangeChange({ start: new Date(), end });
              }}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeRangeSelector; 