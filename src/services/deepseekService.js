import { database } from './firebaseConfig';
import { ref, set, get } from 'firebase/database';

class DeepSeekService {
  constructor() {
    this.baseUrl = 'https://api.deepseek.com/v1'; // Replace with actual DeepSeek API endpoint
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
    this.apiKey = process.env.REACT_APP_DEEPSEEK_API_KEY;
  }

  async makeRequest(endpoint, options = {}) {
    let retries = 0;
    
    while (retries < this.maxRetries) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Log successful API call to Firebase
        await this.logApiCall(endpoint, 'success');
        
        return data;
      } catch (error) {
        retries++;
        
        // Log failed API call to Firebase
        await this.logApiCall(endpoint, 'error', error.message);
        
        if (retries === this.maxRetries) {
          throw new Error(`Failed after ${this.maxRetries} retries: ${error.message}`);
        }
        
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, this.retryDelay * Math.pow(2, retries - 1))
        );
      }
    }
  }

  async logApiCall(endpoint, status, errorMessage = null) {
    try {
      const logRef = ref(database, `apiLogs/${Date.now()}`);
      await set(logRef, {
        endpoint,
        status,
        timestamp: Date.now(),
        errorMessage,
      });
    } catch (error) {
      console.error('Error logging API call:', error);
    }
  }

  // Example method to check API status
  async checkApiStatus() {
    try {
      const response = await this.makeRequest('/status');
      return {
        isOnline: true,
        status: response.status,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        isOnline: false,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  // Add your specific DeepSeek API methods here
  async queryModel(prompt) {
    return this.makeRequest('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        // Add other required parameters
      }),
    });
  }
}

// Create singleton instance
const deepseekService = new DeepSeekService();

export default deepseekService; 