import React, { useState, useEffect } from 'react';
import { database } from '../services/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const SensorDataVisualization = () => {
  const [chartType, setChartType] = useState('line');
  const [sensorData, setSensorData] = useState({});
  const [selectedSensor, setSelectedSensor] = useState('mq7');

  useEffect(() => {
    // Subscribe to real-time updates from Firebase
    const sensorRef = ref(database, 'sensorData');
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Received sensor data:', data);
        // Transform the data to match the expected structure
        const transformedData = {};
        Object.entries(data).forEach(([sensorId, sensorData]) => {
          if (!transformedData[sensorId]) {
            transformedData[sensorId] = {};
          }
          transformedData[sensorId][sensorData.timestamp] = {
            value: sensorData.value,
            type: sensorData.type
          };
        });
        setSensorData(transformedData);
      } else {
        console.log('No sensor data available');
        setSensorData({});
      }
    }, (error) => {
      console.error('Error subscribing to sensor data:', error);
    });

    return () => unsubscribe();
  }, []);

  const prepareChartData = () => {
    const sensorReadings = sensorData[selectedSensor] || {};
    const timestamps = Object.keys(sensorReadings).sort();
    const values = timestamps.map(ts => sensorReadings[ts].value);

    const baseData = {
      labels: timestamps.map(ts => new Date(parseInt(ts)).toLocaleTimeString()),
      datasets: [
        {
          label: `${selectedSensor.toUpperCase()} Readings`,
          data: values,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    };

    switch (chartType) {
      case 'line':
        return {
          ...baseData,
          datasets: [{
            ...baseData.datasets[0],
            tension: 0.1,
          }],
        };
      case 'bar':
        return {
          ...baseData,
          datasets: [{
            ...baseData.datasets[0],
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
          }],
        };
      case 'pie':
        return {
          labels: baseData.labels,
          datasets: [{
            data: values,
            backgroundColor: values.map((_, i) => 
              `hsl(${(i * 360) / values.length}, 70%, 50%)`
            ),
          }],
        };
      default:
        return baseData;
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${selectedSensor.toUpperCase()} Sensor Readings`,
      },
    },
    scales: chartType !== 'pie' ? {
      y: {
        beginAtZero: true,
      },
    } : undefined,
  };

  const renderChart = () => {
    const data = prepareChartData();
    switch (chartType) {
      case 'line':
        return <Line data={data} options={chartOptions} />;
      case 'bar':
        return <Bar data={data} options={chartOptions} />;
      case 'pie':
        return <Pie data={data} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <div className="sensor-visualization">
      <div className="controls">
        <select 
          value={selectedSensor} 
          onChange={(e) => setSelectedSensor(e.target.value)}
          className="sensor-select"
        >
          <option value="mq7">MQ7 (CO)</option>
          <option value="mq9">MQ9 (CO2)</option>
          <option value="mq135">MQ135 (Air Quality)</option>
          <option value="dht11">DHT11 (Temperature)</option>
        </select>

        <div className="chart-type-buttons">
          <button
            className={chartType === 'line' ? 'active' : ''}
            onClick={() => setChartType('line')}
          >
            Line Chart
          </button>
          <button
            className={chartType === 'bar' ? 'active' : ''}
            onClick={() => setChartType('bar')}
          >
            Bar Chart
          </button>
          <button
            className={chartType === 'pie' ? 'active' : ''}
            onClick={() => setChartType('pie')}
          >
            Pie Chart
          </button>
        </div>
      </div>

      <div className="chart-container">
        {renderChart()}
      </div>

      <style jsx>{`
        .sensor-visualization {
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .controls {
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sensor-select {
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ddd;
          font-size: 14px;
        }

        .chart-type-buttons {
          display: flex;
          gap: 10px;
        }

        .chart-type-buttons button {
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .chart-type-buttons button:hover {
          background: #f5f5f5;
        }

        .chart-type-buttons button.active {
          background: #4caf50;
          color: white;
          border-color: #4caf50;
        }

        .chart-container {
          height: 400px;
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default SensorDataVisualization; 