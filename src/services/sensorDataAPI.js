// Simulated sensor data service
const generateRandomValue = (min, max) => {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
};

const getSensorData = () => {
  return {
    mq7: {
      value: generateRandomValue(0, 100),
      unit: 'ppm',
      status: 'normal',
      type: 'Carbon Monoxide'
    },
    mq9: {
      value: generateRandomValue(0, 50),
      unit: 'ppm',
      status: 'normal',
      type: 'CO & Methane'
    },
    mq135: {
      value: generateRandomValue(50, 200),
      unit: 'AQI',
      status: 'normal',
      type: 'Air Quality'
    },
    dht11: {
      value: generateRandomValue(18, 30),
      unit: '°C',
      humidity: generateRandomValue(30, 70),
      status: 'normal',
      type: 'Temperature & Humidity'
    }
  };
};

const updateSensorStatus = (data) => {
  const thresholds = {
    mq7: { warning: 30, critical: 50 },
    mq9: { warning: 20, critical: 40 },
    mq135: { warning: 100, critical: 150 },
    dht11: { warning: 28, critical: 35 }
  };

  Object.keys(data).forEach(sensorId => {
    const sensor = data[sensorId];
    const threshold = thresholds[sensorId];

    if (sensor.value >= threshold.critical) {
      sensor.status = 'critical';
    } else if (sensor.value >= threshold.warning) {
      sensor.status = 'warning';
    } else {
      sensor.status = 'normal';
    }
  });

  return data;
};

const subscribeToSensorUpdates = (callback, interval = 5000) => {
  const updateData = () => {
    const data = getSensorData();
    const updatedData = updateSensorStatus(data);
    callback(updatedData);
  };

  // Initial update
  updateData();

  // Set up interval for regular updates
  const intervalId = setInterval(updateData, interval);

  // Return cleanup function
  return () => clearInterval(intervalId);
};

export { subscribeToSensorUpdates }; 