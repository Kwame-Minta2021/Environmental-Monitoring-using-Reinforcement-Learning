# Smart Air Quality Monitoring System

## 🌍 Overview

This project implements an intelligent air quality monitoring system using IoT sensors, cloud data processing, and reinforcement learning to detect, analyze, and recommend mitigation strategies for environmental pollution. The system provides real-time monitoring of various pollutants while using transformer-based RL models to optimize pollution reduction strategies.

## 📊 System Architecture

The project follows a four-phase implementation approach:

1. **Foundation Setup** - Sensor network deployment and data collection infrastructure
2. **Model Development** - RL framework creation and training
3. **System Integration** - Real-time processing and visualization
4. **Evaluation & Scalability** - Performance assessment and deployment documentation

## 🔌 Hardware Components

### Sensor Network
This project utilizes the following sensors connected to an ESP32 microcontroller:

| Sensor | Parameter Measured | Range | Application |
|--------|-------------------|-------|-------------|
| MQ-9 | Carbon monoxide, Flammable gases | 10-1000 ppm | Combustion monitoring, Fire safety |
| MQ-4 | Methane, Natural gas | 200-10000 ppm | Natural gas leak detection |
| MQ-7 | Carbon monoxide | 20-2000 ppm | Dedicated CO monitoring |
| MQ-135 | Air quality (NH₃, NOₓ, Alcohol, Benzene, Smoke, CO₂) | Varies by pollutant | General air quality assessment |
| DHT11 | Temperature & Humidity | 0-50°C, 20-80% RH | Environmental monitoring |

### Microcontroller
- **ESP32** - Provides WiFi connectivity, multiple analog inputs, and sufficient processing power for edge computing capabilities

## 🔧 Getting Started

### Prerequisites
- Arduino IDE or PlatformIO
- ESP32 board support
- Required libraries:
  - DHT sensor library
  - WiFi and MQTT libraries
  - ArduinoJson
  - Appropriate analog sensor libraries

### Hardware Setup
1. Connect sensors to ESP32:
   - MQ gas sensors require analog input pins
   - DHT11 requires a digital pin
   - Ensure proper power supply (5V for MQ sensors with adequate current)

```
ESP32 Pinout Connections:
- MQ-9  -> Analog pin 36 (VP)
- MQ-4  -> Analog pin 39 (VN)
- MQ-7  -> Analog pin 34
- MQ-135 -> Analog pin 35
- DHT11 -> Digital pin 21
```

2. Calibration:
   - Allow 24-48 hours of burn-in time for gas sensors
   - Use calibration code provided in `/calibration` folder
   - Document baseline readings in clean air conditions

### Software Installation
1. Clone this repository
```bash
git clone https://github.com/yourusername/smart-air-quality-monitoring.git
```

2. Install required libraries through Arduino IDE or PlatformIO

3. Configure cloud connectivity:
   - Update WiFi credentials in `config.h`
   - Set up MQTT broker details or REST API endpoints

4. Flash firmware to ESP32:
   - Select appropriate board in Arduino IDE
   - Upload main sketch from `/firmware` folder

## 📡 Data Flow

1. **Data Acquisition**
   - Sensors collect environmental data at configurable intervals
   - ESP32 processes raw readings and performs initial calibration
   - Data packets are formatted with metadata and timestamps

2. **Data Transmission**
   - MQTT protocol sends data to cloud platform
   - Data is stored in time-series database
   - Real-time processing triggers alerts based on thresholds

3. **Analysis Pipeline**
   - Preprocessing: filtering, normalization, handling missing values
   - Feature extraction for RL model
   - Transformer-based model analyzes temporal patterns

4. **Visualization & Control**
   - Interactive dashboard displays real-time and historical data
   - Pollution heatmaps and trend analysis
   - Recommendation system for pollution mitigation

## 🧠 Machine Learning Features

### Reinforcement Learning Framework
- **State Space**: Multi-dimensional pollution levels, environmental conditions
- **Action Space**: Mitigation recommendations or alert levels
- **Reward Function**: Optimized for pollution reduction efficiency

### Transformer-Based Architecture
- Learns temporal dependencies in pollution patterns
- Predicts future pollution levels based on historical data
- Integrates with RL for optimal decision-making

## 📊 Dashboard Features

- Real-time pollution level visualization
- Historical trend analysis
- Geospatial mapping of sensor data
- Alert configuration and notification system
- Recommendation display based on RL model output

## 📁 Project Structure

```
smart-air-quality-monitoring/
├── firmware/
│   ├── main/                 # Main ESP32 code
│   ├── calibration/          # Sensor calibration routines
│   └── config.h              # Configuration parameters
├── cloud/
│   ├── mqtt-bridge/          # MQTT subscription service
│   ├── database/             # Database schemas and queries
│   └── api/                  # REST API for data access
├── models/
│   ├── preprocessing/        # Data cleaning and preparation
│   ├── feature-engineering/  # State space definition
│   ├── transformer-rl/       # Transformer-based RL implementation
│   └── simulation/           # OpenAI Gym environment
├── dashboard/
│   ├── frontend/             # Web interface
│   └── visualizations/       # Chart and map components
├── docs/
│   ├── deployment/           # Deployment guides
│   ├── api-docs/             # API documentation
│   └── user-manual/          # End-user documentation
└── evaluation/
    ├── benchmarks/           # Performance testing scripts
    └── reports/              # Evaluation results
```

## 🚀 Implementation Phases

### Phase 1: Foundation Setup [HIGH PRIORITY]
- [x] Sensor selection and network design
- [ ] ESP32 firmware development
- [ ] Cloud-based data logging system setup
- [ ] Environmental dataset collection pipeline

### Phase 2: Model Development [CRITICAL]
- [ ] Feature engineering for RL
- [ ] Transformer-based RL model development
- [ ] Simulation environment for training

### Phase 3: System Integration [IMPORTANT]
- [ ] Real-time inference engine
- [ ] Dashboard for visualization
- [ ] API services and decision-making layer

### Phase 4: Evaluation & Scalability [MEDIUM PRIORITY]
- [ ] Performance evaluation report
- [ ] Deployment manual
- [ ] Policy and stakeholder framework

## 📈 Future Expansion

- Additional sensors for wider pollution monitoring:
  - SDS011 for particulate matter (PM2.5 and PM10)
  - MQ-131 for ozone (O₃) detection
- Mobile app development for alerts and monitoring
- Integration with smart city infrastructure
- Automated actuator systems for pollution mitigation

## 🔬 Research Applications

This system provides a foundation for:
- Urban pollution pattern analysis
- Evaluating effectiveness of environmental policies
- Understanding correlations between environmental factors and pollution levels
- Developing predictive models for air quality management

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📬 Contact

For questions or collaboration opportunities, please contact [your-email@example.com](mailto:your-email@example.com).
