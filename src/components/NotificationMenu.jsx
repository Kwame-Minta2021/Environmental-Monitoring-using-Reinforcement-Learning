import React, { useState } from 'react';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

const NotificationMenu = () => {
  const [interval, setInterval] = useState('5min');
  const [enabled, setEnabled] = useState(true);

  const notifications = [
    {
      id: 1,
      title: 'High CO Levels',
      message: 'Carbon Monoxide levels exceeded threshold',
      time: '5 minutes ago',
      type: 'warning'
    },
    {
      id: 2,
      title: 'Temperature Alert',
      message: 'Temperature rose above normal range',
      time: '10 minutes ago',
      type: 'critical'
    },
    {
      id: 3,
      title: 'System Update',
      message: 'Sensor calibration completed successfully',
      time: '1 hour ago',
      type: 'info'
    }
  ];

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-warning-light dark:bg-warning-dark border-warning-DEFAULT';
      case 'critical':
        return 'bg-danger-light dark:bg-danger-dark border-danger-DEFAULT';
      default:
        return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600';
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Enabled
            </label>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="1min">Every 1 minute</option>
          <option value="5min">Every 5 minutes</option>
          <option value="15min">Every 15 minutes</option>
          <option value="manual">Manual only</option>
        </select>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-l-4 ${getNotificationStyle(
              notification.type
            )}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {notification.message}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {notification.time}
                </span>
              </div>
              <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationMenu; 