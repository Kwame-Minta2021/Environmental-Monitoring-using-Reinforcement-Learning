import React, { useEffect, useState } from 'react';
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
  ScatterController
} from 'chart.js';
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2';
import { format } from 'date-fns';

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
  Legend,
  ScatterController
);

const SensorDataChart = ({ data, chartType, timeRange, selectedSensors }) => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    if (!data || !selectedSensors.length) {
      console.log('No data or sensors selected:', { data, selectedSensors });
      return;
    }

    console.log('Preparing chart data with:', {
      dataLength: data.length,
      selectedSensors,
      chartType,
      timeRange
    });

    const prepareChartData = () => {
      const datasets = selectedSensors.map(sensor => {
        const sensorData = data.filter(d => d.sensorId === sensor.id);
        console.log(`Preparing data for sensor ${sensor.id}:`, {
          dataPoints: sensorData.length,
          firstPoint: sensorData[0],
          lastPoint: sensorData[sensorData.length - 1]
        });
        const color = getSensorColor(sensor.id);

        return {
          label: `${sensor.name} (${sensor.type})`,
          data: sensorData.map(d => ({
            x: new Date(d.timestamp),
            y: d.value
          })),
          borderColor: color,
          backgroundColor: color + '80', // 50% opacity
          tension: 0.1
        };
      });

      return {
        datasets
      };
    };

    const getChartOptions = () => {
      const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 750,
          easing: 'easeInOutQuart'
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw.y;
                const sensor = selectedSensors.find(s => s.id === context.dataset.label.split(' ')[0].toLowerCase());
                return `${context.dataset.label}: ${value} ${sensor.unit}`;
              }
            }
          }
        }
      };

      if (chartType !== 'pie' && chartType !== 'scatter') {
        baseOptions.scales = {
          x: {
            type: 'time',
            time: {
              unit: getTimeUnit(timeRange),
              displayFormats: {
                hour: 'HH:mm',
                day: 'MMM d',
                week: 'MMM d',
                month: 'MMM d'
              }
            },
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Value'
            }
          }
        };
      }

      return baseOptions;
    };

    const chartData = prepareChartData();
    const chartOptions = getChartOptions();
    
    console.log('Final chart configuration:', {
      datasets: chartData.datasets.map(d => ({
        label: d.label,
        dataPoints: d.data.length
      })),
      options: chartOptions
    });

    setChartData(chartData);
    setChartOptions(chartOptions);
  }, [data, chartType, timeRange, selectedSensors]);

  const getSensorColor = (sensorId) => {
    const colors = {
      mq7: '#FF6B6B',    // Red for CO
      mq9: '#4ECDC4',    // Teal for CO/Methane
      mq135: '#45B7D1',  // Blue for Air Quality
      dht11: '#96CEB4'   // Green for Temperature/Humidity
    };
    return colors[sensorId] || '#666666';
  };

  const getTimeUnit = (range) => {
    switch (range) {
      case '24h':
        return 'hour';
      case '7d':
        return 'day';
      case '30d':
        return 'day';
      default:
        return 'hour';
    }
  };

  const renderChart = () => {
    if (!chartData || !chartOptions) return null;

    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'pie':
        return <Pie data={chartData} options={chartOptions} />;
      case 'scatter':
        return <Scatter data={chartData} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-[500px] p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      {renderChart()}
    </div>
  );
};

export default SensorDataChart; 