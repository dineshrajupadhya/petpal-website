import React, { useState } from 'react';
import { MessageCircle, X, Send, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <Link 
        to="/chat" 
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 w-16 h-16 flex items-center justify-center group"
        title="Chat with support"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
      </Link>

      {/* Mini preview on hover */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 max-h-96 overflow-hidden z-40">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">PetPal Support</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-4 text-sm text-gray-600 max-h-48 overflow-y-auto">
            <p>👋 Hi there! Need help with adoption, shopping, or pet health?</p>
            <div className="mt-3 flex gap-2">
              <Link to="/chat" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition-colors font-medium text-sm" onClick={() => setIsOpen(false)}>
                Start Chat
              </Link>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
