import { database } from './firebaseConfig';
import { ref, onValue, query, orderByChild, startAt, endAt, get, set } from 'firebase/database';

class SensorDataService {
  constructor() {
    this.sensorDataRef = ref(database, 'sensorData');
  }

  // Subscribe to real-time sensor data updates
  subscribeToSensorData(callback) {
    console.log('Subscribing to real-time sensor data');
    const unsubscribe = onValue(this.sensorDataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Received real-time sensor data:', data);
        // Transform the data to match the expected structure
        const transformedData = Object.entries(data).map(([timestamp, reading]) => ({
          ...reading,
          timestamp: parseInt(timestamp)
        }));
        callback(transformedData);
      } else {
        console.log('No sensor data available');
        callback([]);
      }
    }, (error) => {
      console.error('Error subscribing to sensor data:', error);
      callback([]);
    });

    return unsubscribe;
  }

  // Fetch historical sensor data
  async fetchHistoricalData(startDate, endDate, sensorIds) {
    try {
      console.log('Fetching historical data:', { startDate, endDate, sensorIds });
      const sensorDataQuery = query(
        this.sensorDataRef,
        orderByChild('timestamp'),
        startAt(startDate.getTime()),
        endAt(endDate.getTime())
      );

      const snapshot = await get(sensorDataQuery);
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Retrieved historical data:', data);
        
        // Convert to array and filter by sensor IDs
        const filteredData = Object.values(data).filter(reading => 
          sensorIds.includes(reading.sensorId)
        );
        
        return filteredData;
      }
      return [];
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }

  // Save new sensor reading
  async saveSensorReading(reading) {
    try {
      const newReadingRef = ref(database, `sensorData/${Date.now()}`);
      await set(newReadingRef, {
        ...reading,
        timestamp: Date.now()
      });
      console.log('Saved new sensor reading:', reading);
    } catch (error) {
      console.error('Error saving sensor reading:', error);
      throw error;
    }
  }

  // Add this method to the SensorDataService class
  async testConnection() {
    try {
      const testData = {
        sensorId: 'mq7',
        value: 25,
        type: 'Carbon Monoxide',
        timestamp: Date.now()
      };
      
      await this.saveSensorReading(testData);
      console.log('Test data saved successfully');
      return true;
    } catch (error) {
      console.error('Error testing connection:', error);
      return false;
    }
  }
}

// Create singleton instance
const sensorDataService = new SensorDataService();

export default sensorDataService; 