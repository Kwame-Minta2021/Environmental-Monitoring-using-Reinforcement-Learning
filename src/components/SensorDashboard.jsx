import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import TimeRangeSelector from './TimeRangeSelector';
import ChartTypeSelector from './ChartTypeSelector';
import SensorDataChart from './SensorDataChart';
import sensorDataService from '../services/sensorDataService';

const SensorDashboard = () => {
  // State management with local storage persistence
  const [selectedRange, setSelectedRange] = useLocalStorage('selectedRange', '24h');
  const [chartType, setChartType] = useLocalStorage('chartType', 'line');
  const [selectedSensors, setSelectedSensors] = useLocalStorage('selectedSensors', [
    { id: 'mq7', name: 'MQ-7', type: 'Carbon Monoxide', unit: 'ppm' },
    { id: 'mq9', name: 'MQ-9', type: 'CO & Methane', unit: 'ppm' },
    { id: 'mq135', name: 'MQ-135', type: 'Air Quality', unit: 'AQI' },
    { id: 'dht11', name: 'DHT11', type: 'Temperature', unit: '°C' }
  ]);
  const [sensorData, setSensorData] = useState([]);
  const [dateRange, setDateRange] = useState(null);

  // Subscribe to real-time updates
  useEffect(() => {
    if (selectedRange === 'live') {
      console.log('Setting up real-time data subscription');
      const unsubscribe = sensorDataService.subscribeToSensorData((data) => {
        console.log('Received real-time data update:', data);
        // Convert object to array and keep last 1000 readings
        const dataArray = Object.values(data);
        setSensorData(dataArray.slice(-1000));
      });

      return () => {
        console.log('Cleaning up real-time subscription');
        unsubscribe();
      };
    }
  }, [selectedRange]);

  // Fetch historical data when range changes
  useEffect(() => {
    if (selectedRange !== 'live' && dateRange) {
      console.log('Fetching historical data for range:', selectedRange, dateRange);
      fetchHistoricalData();
    }
  }, [selectedRange, dateRange]);

  const fetchHistoricalData = async () => {
    try {
      const data = await sensorDataService.fetchHistoricalData(
        dateRange.start,
        dateRange.end,
        selectedSensors.map(s => s.id)
      );
      console.log('Fetched historical data:', data);
      setSensorData(data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  const handleSensorToggle = (sensorId) => {
    setSelectedSensors(prev => {
      const sensor = prev.find(s => s.id === sensorId);
      if (sensor) {
        return prev.filter(s => s.id !== sensorId);
      } else {
        const newSensor = {
          id: sensorId,
          name: sensorId.toUpperCase(),
          type: getSensorType(sensorId),
          unit: getSensorUnit(sensorId)
        };
        return [...prev, newSensor];
      }
    });
  };

  const getSensorType = (sensorId) => {
    const types = {
      mq7: 'Carbon Monoxide',
      mq9: 'CO & Methane',
      mq135: 'Air Quality',
      dht11: 'Temperature'
    };
    return types[sensorId] || 'Unknown';
  };

  const getSensorUnit = (sensorId) => {
    const units = {
      mq7: 'ppm',
      mq9: 'ppm',
      mq135: 'AQI',
      dht11: '°C'
    };
    return units[sensorId] || '';
  };

  useEffect(() => {
    // Test the connection when the component mounts
    const testConnection = async () => {
      const isConnected = await sensorDataService.testConnection();
      console.log('Database connection test:', isConnected ? 'Success' : 'Failed');
    };
    
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Environmental Monitoring Dashboard
          </h1>
          <div className="flex flex-wrap gap-4">
            <TimeRangeSelector
              selectedRange={selectedRange}
              onRangeChange={setSelectedRange}
              onCustomRangeChange={setDateRange}
            />
            <ChartTypeSelector
              selectedType={chartType}
              onTypeChange={setChartType}
            />
          </div>
        </div>

        {/* Sensor Selection */}
        <div className="flex flex-wrap gap-2">
          {selectedSensors.map(sensor => (
            <button
              key={sensor.id}
              onClick={() => handleSensorToggle(sensor.id)}
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow duration-200"
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {sensor.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                {sensor.type}
              </span>
            </button>
          ))}
        </div>

        {/* Chart */}
        <SensorDataChart
          data={sensorData}
          chartType={chartType}
          timeRange={selectedRange}
          selectedSensors={selectedSensors}
        />

        {/* Status Bar */}
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>
            Last updated: {new Date().toLocaleTimeString()}
          </span>
          <span>
            {selectedRange === 'live' ? 'Live Mode' : 'Historical Data'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SensorDashboard; 