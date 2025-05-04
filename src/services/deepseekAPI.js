const DEEPSEEK_API_KEY = 'sk-c95c2f20bd704a65a3eef5c30671e5d4';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

const systemPrompt = `You are an environmental monitoring assistant. You help users understand sensor readings, health effects, and provide recommendations. You have access to real-time sensor data for:
- MQ-7: Carbon Monoxide (CO)
- MQ-9: CO and Methane (CH₄)
- MQ-135: Air Quality (NH₃, Benzene, AQI)
- DHT11: Temperature (°C) and Humidity (%)

Keep responses concise, professional, and focused on environmental monitoring and health impacts.`;

export const generateAIResponse = async (message, sensors) => {
  try {
    const sensorContext = `Current sensor readings:\n${sensors.map(sensor => 
      `${sensor.name} (${sensor.type}): ${sensor.value}${sensor.unit}`
    ).join('\n')}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'system', content: sensorContext },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    return generateFallbackResponse(message, sensors);
  }
};

// Fallback response generator in case API fails
const generateFallbackResponse = (message, sensors) => {
  const msg = message.toLowerCase();
  
  // Check for sensor value questions
  for (const sensor of sensors) {
    if (msg.includes(sensor.name.toLowerCase()) && msg.includes('level')) {
      return `The current ${sensor.type} level is ${sensor.value} ${sensor.unit}.`;
    }
  }

  // Check for health effects
  if (msg.includes('health') || msg.includes('effect')) {
    return "I'm currently having trouble accessing detailed health information. Please check the Health Impact Analysis chart on the dashboard for more information.";
  }

  // Default response
  return "I apologize, but I'm having trouble connecting to my knowledge base. Please try again later or refer to the dashboard for current readings and health impacts.";
}; 