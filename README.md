# Environmental Monitoring Dashboard

A professional and interactive dashboard for monitoring environmental sensors with real-time data visualization, health impact analysis, and reinforcement learning-based alerting.

## Features

- 🔄 Real-time sensor monitoring
  - MQ-7: Carbon Monoxide (CO)
  - MQ-9: CO and Methane (CH₄)
  - MQ-135: Air Quality (NH₃, Benzene, AQI)
  - DHT11: Temperature (°C) and Humidity (%)

- 📊 Interactive Data Visualization
  - Real-time sensor readings
  - Time-series graphs
  - Health impact analysis
  - Color-coded status indicators

- 🔔 Smart Notification System
  - Reinforcement learning-based alerting
  - Customizable update intervals
  - Toast notifications
  - Alert history tracking

- 🌗 Dark/Light Mode Support
  - System preference detection
  - Manual toggle
  - Persistent theme selection

- 📄 PDF Report Generation
  - Comprehensive sensor data
  - Health impact analysis
  - Alert history
  - Recommendations

## Technology Stack

- React.js
- Tailwind CSS
- Recharts
- jsPDF
- date-fns
- React-Toastify

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
monitoring/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── SensorCard.jsx
│   │   ├── SensorChart.jsx
│   │   ├── NotificationMenu.jsx
│   │   ├── HealthEffectChart.jsx
│   │   ├── PDFExporter.js
│   │   └── ThemeToggle.jsx
│   ├── pages/
│   │   └── Dashboard.jsx
│   ├── services/
│   │   ├── sensorDataAPI.js
│   │   └── alertManager.js
│   ├── context/
│   │   └── ThemeContext.js
│   ├── App.js
│   └── index.js
├── tailwind.config.js
└── package.json
```

## Features in Detail

### Sensor Monitoring
- Real-time data updates
- Status indicators (Normal, Warning, Critical)
- Trend visualization
- Historical data tracking

### Health Impact Analysis
- WHO/CDC guideline integration
- Risk level assessment
- Symptom correlation
- Recommended actions

### Alert System
- Reinforcement learning adaptation
- False alarm reduction
- Critical condition detection
- Customizable thresholds

### PDF Reports
- Comprehensive data export
- Professional formatting
- Automated recommendations
- Time-stamped records

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 