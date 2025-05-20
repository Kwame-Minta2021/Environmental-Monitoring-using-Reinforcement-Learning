import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import deepseekService from '../services/deepseekService';

const ApiStatusMonitor = () => {
  const [status, setStatus] = useState({
    isOnline: false,
    lastChecked: null,
    error: null
  });

  const checkStatus = async () => {
    try {
      const result = await deepseekService.checkApiStatus();
      setStatus({
        isOnline: result.isOnline,
        lastChecked: new Date(),
        error: result.error
      });

      if (!result.isOnline) {
        toast.error('DeepSeek API is offline. Retrying...');
      } else if (status.error) {
        toast.success('DeepSeek API is back online!');
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isOnline: false,
        lastChecked: new Date(),
        error: error.message
      }));
      toast.error('Failed to check DeepSeek API status');
    }
  };

  useEffect(() => {
    // Check status immediately
    checkStatus();

    // Set up periodic status checks
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="api-status-monitor">
      <div className={`status-indicator ${status.isOnline ? 'online' : 'offline'}`}>
        <span className="status-dot"></span>
        <span className="status-text">
          DeepSeek API: {status.isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
      {status.error && (
        <div className="error-message">
          Error: {status.error}
        </div>
      )}
      {status.lastChecked && (
        <div className="last-checked">
          Last checked: {status.lastChecked.toLocaleTimeString()}
        </div>
      )}
      <style jsx>{`
        .api-status-monitor {
          padding: 10px;
          border-radius: 4px;
          background-color: #f5f5f5;
          margin: 10px 0;
        }
        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }
        .online .status-dot {
          background-color: #4caf50;
        }
        .offline .status-dot {
          background-color: #f44336;
        }
        .error-message {
          color: #f44336;
          margin-top: 5px;
          font-size: 0.9em;
        }
        .last-checked {
          color: #666;
          font-size: 0.8em;
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
};

export default ApiStatusMonitor; 