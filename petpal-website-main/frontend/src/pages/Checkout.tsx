import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, Truck, Shield, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Checkout() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = state.cart.reduce((total, cartItem) => {
    const price = 'price' in cartItem.item ? cartItem.item.price : cartItem.item.adoptionFee || 0;
    return total + (price * cartItem.quantity);
  }, 0);

  const shipping = subtotal > 35 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    navigate('/order-confirmation', { state: { orderId: 'ORD-' + Date.now().toString().slice(-6), total } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/cart" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="123 Pet Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Animal City" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="12345" />
                  </div>
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Continue to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Payment Information</h2>
              <div className="space-y-3">
                <button onClick={() => setPaymentMethod('card')} className={`w-full p-4 border rounded-lg flex items-center space-x-3 ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                  <CreditCard className="w-6 h-6" />
                  <span>Credit/Debit Card</span>
                </button>
                <button onClick={() => setPaymentMethod('paypal')} className={`w-full p-4 border rounded-lg flex items-center space-x-3 ${paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                  <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-medium">PayPal</div>
                  <span>PayPal</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                      <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="123" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
                  </div>
                </div>
              )}

              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors font-semibold text-lg flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>{isProcessing ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}</span>
              </button>
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({state.cart.length})</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-green-500" />
                  Secure payment guaranteed
                </div>
                <div className="flex items-center">
                  <Truck className="w-4 h-4 mr-2 text-green-500" />
                  Free shipping on orders over $35
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-500" />
                  30-day money back guarantee
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
