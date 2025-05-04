import { toast } from 'react-toastify';

class AlertManager {
  constructor() {
    this.thresholds = {
      mq7: { warning: 30, critical: 50 },
      mq9: { warning: 20, critical: 40 },
      mq135: { warning: 100, critical: 150 },
      dht11: { warning: 28, critical: 35 }
    };

    // RL state
    this.state = {
      falseAlarms: 0,
      missedAlerts: 0,
      successfulAlerts: 0,
      sensitivityMultiplier: 1.0
    };

    // Learning rate
    this.alpha = 0.1;
  }

  // Simulate RL reward function
  calculateReward(alertTriggered, actualDanger) {
    if (alertTriggered && actualDanger) return 1; // True positive
    if (alertTriggered && !actualDanger) return -1; // False positive
    if (!alertTriggered && actualDanger) return -2; // False negative
    return 0.5; // True negative
  }

  // Update RL policy
  updatePolicy(reward) {
    const oldSensitivity = this.state.sensitivityMultiplier;
    const newSensitivity = oldSensitivity + this.alpha * reward;
    
    // Clamp sensitivity between 0.5 and 2.0
    this.state.sensitivityMultiplier = Math.max(0.5, Math.min(2.0, newSensitivity));
  }

  // Get adjusted threshold based on RL policy
  getAdjustedThreshold(sensorId, type) {
    const baseThreshold = this.thresholds[sensorId][type];
    return baseThreshold * this.state.sensitivityMultiplier;
  }

  // Check if value exceeds threshold with RL adjustment
  checkThreshold(sensorId, value, type = 'warning') {
    const adjustedThreshold = this.getAdjustedThreshold(sensorId, type);
    return value >= adjustedThreshold;
  }

  // Process sensor data and trigger alerts
  processSensorData(data) {
    Object.entries(data).forEach(([sensorId, sensorData]) => {
      const { value, type } = sensorData;
      
      // Check for critical conditions
      if (this.checkThreshold(sensorId, value, 'critical')) {
        this.triggerAlert({
          title: `Critical Alert: ${type}`,
          message: `${type} level is critically high: ${value}`,
          type: 'error'
        });
        
        // Update RL state
        this.state.successfulAlerts++;
        this.updatePolicy(1);
      }
      // Check for warnings
      else if (this.checkThreshold(sensorId, value, 'warning')) {
        this.triggerAlert({
          title: `Warning: ${type}`,
          message: `${type} level is elevated: ${value}`,
          type: 'warning'
        });
        
        // Update RL state
        this.updatePolicy(0.5);
      }
    });
  }

  // Trigger alert using toast notification
  triggerAlert({ title, message, type }) {
    const toastOptions = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };

    switch (type) {
      case 'error':
        toast.error(`${title}\n${message}`, toastOptions);
        break;
      case 'warning':
        toast.warning(`${title}\n${message}`, toastOptions);
        break;
      default:
        toast.info(`${title}\n${message}`, toastOptions);
    }
  }

  // Get current RL state
  getState() {
    return {
      ...this.state,
      currentSensitivity: this.state.sensitivityMultiplier
    };
  }
}

// Create singleton instance
const alertManager = new AlertManager();

export default alertManager; 