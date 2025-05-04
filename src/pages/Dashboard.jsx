import React, { useState } from 'react';
import { format } from 'date-fns';
import { BellIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import NotificationMenu from '../components/NotificationMenu';
import SensorCard from '../components/SensorCard';
import HealthEffectChart from '../components/HealthEffectChart';
import PDFExporter from '../components/PDFExporter';
import Chatbot from '../components/Chatbot';

const Dashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { darkMode } = useTheme();

  const sensors = [
    {
      id: 'mq7',
      name: 'MQ-7',
      type: 'Carbon Monoxide',
      value: 5.2,
      unit: 'ppm',
      status: 'normal',
      icon: '🌬️'
    },
    {
      id: 'mq9',
      name: 'MQ-9',
      type: 'CO & Methane',
      value: 2.8,
      unit: 'ppm',
      status: 'warning',
      icon: '🔥'
    },
    {
      id: 'mq135',
      name: 'MQ-135',
      type: 'Air Quality',
      value: 150,
      unit: 'AQI',
      status: 'critical',
      icon: '🌫️'
    },
    {
      id: 'dht11',
      name: 'DHT11',
      type: 'Temperature & Humidity',
      value: 24.5,
      unit: '°C',
      humidity: 45,
      status: 'normal',
      icon: '🌡️'
    }
  ];

  const handleExportPDF = () => {
    const alerts = [
      {
        title: 'High CO Levels',
        message: 'Carbon Monoxide levels exceeded threshold',
        time: format(new Date(), 'PPP pp'),
        type: 'warning'
      },
      {
        title: 'Critical Air Quality',
        message: 'Air Quality Index is at hazardous levels',
        time: format(new Date(), 'PPP pp'),
        type: 'error'
      }
    ];

    PDFExporter.generateReport({ sensors, alerts });
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Environmental Monitor
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-300">
                {format(new Date(), 'PPP')}
              </span>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                <span>Export PDF</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
                {showNotifications && <NotificationMenu />}
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sensors.map((sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>

        {/* Health Effects Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Health Impact Analysis
          </h2>
          <HealthEffectChart sensors={sensors} />
        </div>
      </main>

      {/* Chatbot */}
      <Chatbot sensors={sensors} />
    </div>
  );
};

export default Dashboard; 