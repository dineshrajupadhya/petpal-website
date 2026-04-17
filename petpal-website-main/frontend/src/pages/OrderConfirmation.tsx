import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, ShoppingBag, Truck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const { orderId, total } = location.state || {};

  const handleContinueShopping = () => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: '' }); // Clear cart - fix for all items
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl mx-auto">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-8">Thank you for your purchase. Your order has been received and is being processed.</p>
          
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-green-900 mb-4">Order #{orderId}</h2>
            <div className="space-y-2 text-left">
              <div className="flex justify-between text-lg">
                <span>Total Paid:</span>
                <span className="font-bold">${total?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="text-green-800">
                <Truck className="w-5 h-5 inline mr-2" />
                <span>Order shipped within 2-3 business days</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={handleContinueShopping}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Continue Shopping
            </button>
            <Link 
              to="/profile"
              className="px-8 py-4 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors font-semibold text-lg flex items-center justify-center"
            >
              View Order
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500 space-y-2">
            <p>You'll receive an email confirmation shortly with your order details and tracking information.</p>
            <p>Need help? Contact support@petpal.com or call (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}
