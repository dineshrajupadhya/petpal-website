import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { chatAPI } from '../services/api';

export default function ChatWidget() {
  const { state, dispatch } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `widget_${Date.now()}`);
  const [localMessages, setLocalMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'bot';
    message: string;
    timestamp: Date;
  }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !state.user) return;

    const userMessage = inputMessage;
    setInputMessage('');

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user' as const,
      message: userMessage,
      timestamp: new Date()
    };
    setLocalMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await chatAPI.sendMessage(sessionId, userMessage, 'user');
      const chat = res.data.chat;
      if (chat?.messages?.length > 0) {
        const botMsgs = chat.messages.filter((m: Record<string, unknown>) => m.sender === 'bot');
        const lastBot = botMsgs[botMsgs.length - 1];
        if (lastBot) {
          setLocalMessages(prev => [...prev, {
            id: `bot_${Date.now()}`,
            sender: 'bot',
            message: lastBot.message as string,
            timestamp: new Date()
          }]);
        }
      }
    } catch {
      setLocalMessages(prev => [...prev, {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        message: "I'm here to help! Could you please rephrase your question?",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickReplies = [
    "Hi, I need help",
    "I want to adopt a pet",
    "My pet is sick",
    "Product recommendations"
  ];

  return (
    <>
      {/* Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">PetPal Assistant</h3>
                <p className="text-xs text-blue-100">{isTyping ? 'Typing...' : 'Online'}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-blue-500 rounded-full p-1 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {!state.user ? (
              <div className="text-center py-8">
                <Bot className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm mb-3">Please log in to chat with our AI assistant</p>
                <a href="/login" className="text-blue-600 text-sm font-medium hover:underline">Log In</a>
              </div>
            ) : localMessages.length === 0 ? (
              <div className="text-center py-4">
                <Bot className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <p className="text-gray-700 text-sm font-medium mb-1">Hi! I'm PetPal AI</p>
                <p className="text-gray-500 text-xs mb-4">Ask me anything about pets, adoption, health, or products.</p>
                <div className="space-y-2">
                  {quickReplies.map((reply, i) => (
                    <button
                      key={i}
                      onClick={() => { setInputMessage(reply); }}
                      className="block w-full text-left text-xs px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              localMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}>
                    {msg.sender === 'bot' && <Bot className="w-3 h-3 inline mr-1 mb-0.5" />}
                    {msg.sender === 'user' && <User className="w-3 h-3 inline mr-1 mb-0.5" />}
                    {msg.message}
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-lg rounded-bl-none">
                  <div className="flex items-center space-x-1">
                    <Bot className="w-3 h-3" />
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {state.user && (
            <div className="border-t p-3">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about pets..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim()}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
