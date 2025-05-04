import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const HealthEffectChart = ({ sensors }) => {
  // Transform sensor data for visualization
  const healthData = sensors.map(sensor => {
    let healthImpact = 0;
    let riskLevel = 'Safe';
    let symptoms = [];

    // Calculate health impact based on sensor type and value
    switch (sensor.name) {
      case 'MQ-7': // CO
        if (sensor.value > 50) {
          healthImpact = 100;
          riskLevel = 'Hazardous';
          symptoms = ['Headache', 'Dizziness', 'Nausea'];
        } else if (sensor.value > 10) {
          healthImpact = 50;
          riskLevel = 'Mild';
          symptoms = ['Mild headache'];
        } else {
          healthImpact = 10;
        }
        break;
      case 'MQ-135': // Air Quality
        if (sensor.value > 150) {
          healthImpact = 80;
          riskLevel = 'Hazardous';
          symptoms = ['Respiratory issues', 'Eye irritation'];
        } else if (sensor.value > 100) {
          healthImpact = 40;
          riskLevel = 'Mild';
          symptoms = ['Minor respiratory discomfort'];
        } else {
          healthImpact = 5;
        }
        break;
      default:
        healthImpact = 0;
    }

    return {
      name: sensor.name,
      impact: healthImpact,
      riskLevel,
      symptoms: symptoms.join(', '),
      value: sensor.value,
      unit: sensor.unit
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            {data.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Current Value: {data.value} {data.unit}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Risk Level: {data.riskLevel}
          </p>
          {data.symptoms && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Potential Symptoms: {data.symptoms}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={healthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fill: 'currentColor' }}
            className="text-gray-600 dark:text-gray-300"
          />
          <YAxis
            tick={{ fill: 'currentColor' }}
            className="text-gray-600 dark:text-gray-300"
            label={{
              value: 'Health Impact Score',
              angle: -90,
              position: 'insideLeft',
              fill: 'currentColor'
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="impact"
            fill="#0ea5e9"
            radius={[4, 4, 0, 0]}
            className="dark:opacity-80"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HealthEffectChart; 