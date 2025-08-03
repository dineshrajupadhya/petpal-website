import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Phone, Mail, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Chat() {
  const { state, dispatch } = useApp();
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatMessages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        sender: 'user',
        message: inputMessage
      }
    });

    const userMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          sender: 'bot',
          message: botResponse
        }
      });
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('adoption') || lowerMessage.includes('adopt')) {
      return "I'd be happy to help you with pet adoption! We have many wonderful pets looking for homes. You can browse our available pets on the adoption page, or I can help you find specific breeds or types of pets. What kind of pet are you interested in adopting?";
    }
    
    if (lowerMessage.includes('sick') || lowerMessage.includes('symptoms') || lowerMessage.includes('health')) {
      return "I'm concerned about your pet's health. While I can provide general information, it's always best to consult with a veterinarian for proper diagnosis and treatment. You can check our Pet Health Guide for common conditions, but please don't hesitate to contact your vet if you're worried about your pet's symptoms.";
    }
    
    if (lowerMessage.includes('food') || lowerMessage.includes('diet') || lowerMessage.includes('eating')) {
      return "Proper nutrition is essential for your pet's health! We have a wide selection of high-quality pet foods in our store. The best diet depends on your pet's age, size, activity level, and any health conditions. I recommend consulting with your vet for personalized dietary advice.";
    }
    
    if (lowerMessage.includes('training') || lowerMessage.includes('behavior')) {
      return "Pet training and behavior are important topics! While I can provide some general tips, working with a professional trainer or behaviorist often gives the best results. Positive reinforcement, consistency, and patience are key to successful training.";
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      return "If this is a pet emergency, please contact your nearest emergency veterinary clinic immediately! For immediate assistance, call: (555) EMERGENCY. I'm here to help with general questions, but emergencies require professional veterinary care right away.";
    }
    
    if (lowerMessage.includes('store') || lowerMessage.includes('buy') || lowerMessage.includes('product')) {
      return "Our pet store has everything you need for your furry friends! From premium food and toys to beds and accessories, we stock high-quality products from trusted brands. You can browse our store online or visit us in person. Is there something specific you're looking for?";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
      return "Hello! I'm PetPal's AI assistant, and I'm here to help you with all your pet-related questions. I can assist with information about pet adoption, health concerns, products in our store, and general pet care advice. How can I help you today?";
    }
    
    return "Thank you for your question! I'm here to help with pet adoption, health information, product recommendations, and general pet care advice. Could you please provide more details about what you'd like to know? For complex issues, I can also connect you with our human support team.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    "I'm interested in adopting a pet",
    "My pet is showing symptoms",
    "I need product recommendations",
    "Tell me about pet care",
    "Connect me with support"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pet Support Chat
          </h1>
          <p className="text-xl text-gray-600">
            Get instant help from our AI assistant or connect with our support team
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Support Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Phone</div>
                    <div className="text-sm text-gray-600">(555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-sm text-gray-600">support@petpal.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Hours</div>
                    <div className="text-sm text-gray-600">24/7 Available</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(action)}
                    className="w-full text-left p-2 text-sm text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Chat Header */}
              <div className="bg-blue-600 text-white p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">PetPal Assistant</h3>
                    <p className="text-sm text-blue-100">Online • Ready to help</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {state.chatMessages.length === 0 && (
                  <div className="text-center py-8">
                    <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Welcome to PetPal Support!
                    </h3>
                    <p className="text-gray-600">
                      I'm here to help with all your pet-related questions. How can I assist you today?
                    </p>
                  </div>
                )}

                {state.chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender !== 'user' && (
                          <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                        )}
                        {message.sender === 'user' && (
                          <User className="w-4 h-4 mt-1 flex-shrink-0" />
                        )}
                        <p className="text-sm">{message.message}</p>
                      </div>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <Phone className="w-6 h-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Pet Emergency?
              </h3>
              <p className="text-red-800 text-sm leading-relaxed">
                If your pet is experiencing a medical emergency, please contact your nearest emergency 
                veterinary clinic immediately. For life-threatening situations, don't wait - seek professional help right away.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}