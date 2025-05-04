import React, { useState, useRef, useEffect } from 'react';
import { ChatBubbleLeftIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { generateAIResponse } from '../services/deepseekAPI';

const Chatbot = ({ sensors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I\'m your environmental monitoring assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get AI response
      const response = await generateAIResponse(input, sensors);
      setMessages(prev => [...prev, { type: 'bot', content: response }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'I apologize, but I\'m having trouble processing your request. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateBotResponse = (message, sensors) => {
    // Check for sensor value questions
    for (const sensor of sensors) {
      if (message.includes(sensor.name.toLowerCase()) && message.includes('level')) {
        return `The current ${sensor.type} level is ${sensor.value} ${sensor.unit}.`;
      }
    }

    // Check for health effects questions
    if (message.includes('health') || message.includes('effect') || message.includes('mean')) {
      for (const sensor of sensors) {
        if (message.includes(sensor.name.toLowerCase())) {
          return generateHealthEffect(sensor);
        }
      }
    }

    // Check for recommendations
    if (message.includes('reduce') || message.includes('improve') || message.includes('how')) {
      if (message.includes('co') || message.includes('carbon monoxide')) {
        return "To reduce CO levels: 1) Improve ventilation 2) Check fuel-burning appliances 3) Install CO detectors 4) Regular maintenance of heating systems.";
      }
      if (message.includes('air quality') || message.includes('aqi')) {
        return "To improve air quality: 1) Use air purifiers 2) Regular cleaning 3) Control humidity 4) Proper ventilation 5) Remove sources of pollutants.";
      }
    }

    // Default responses
    if (message.includes('help')) {
      return "I can help you with: \n- Current sensor readings\n- Health effects explanation\n- Recommendations for improvement\n- Troubleshooting guidance";
    }

    return "I'm not sure about that. You can ask me about:\n- Current sensor levels\n- Health effects\n- How to improve readings\n- General troubleshooting";
  };

  const generateHealthEffect = (sensor) => {
    switch (sensor.name) {
      case 'MQ-7':
        return "Carbon Monoxide (CO) is dangerous because it binds to hemoglobin, reducing oxygen transport. Levels:\n- <10ppm: Safe\n- 10-50ppm: Mild symptoms (headaches)\n- >50ppm: Severe (dizziness, nausea)";
      case 'MQ-9':
        return "CO & Methane sensor monitors two dangerous gases. High levels can cause:\n- Oxygen deprivation\n- Explosion risks\n- Respiratory issues";
      case 'MQ-135':
        return "Air Quality Index indicates overall air safety:\n- <100: Good to Moderate\n- 100-150: Unhealthy for sensitive groups\n- >150: Unhealthy to Hazardous";
      case 'DHT11':
        return "Temperature & Humidity affect comfort and health:\n- Ideal: 20-25°C, 30-50% humidity\n- High humidity can promote mold growth\n- Low humidity can cause respiratory irritation";
      default:
        return "I don't have specific health effect information for this sensor.";
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-colors duration-200 ${
          isOpen ? 'hidden' : ''
        }`}
      >
        <ChatBubbleLeftIcon className="h-6 w-6" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Environmental Assistant
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-700">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about sensor readings, health effects..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`p-2 bg-primary-600 text-white rounded-lg transition-colors duration-200 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'
                }`}
                disabled={isLoading}
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot; 