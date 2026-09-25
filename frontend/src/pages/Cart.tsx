import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Cart() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    else dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, quantity: newQuantity } });
  };

  const removeItem = (id: string) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });

  const getItemPrice = (item: Record<string, unknown>) => {
    return (item.price as number) || (item.adoptionFee as number) || 0;
  };

  const subtotal = state.cart.reduce((total, cartItem) => total + (getItemPrice(cartItem.item as Record<string, unknown>) * cartItem.quantity), 0);
  const shipping = subtotal >= 2999 ? 0 : 49;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!state.user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-8" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-xl text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/store" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">Shop Products</Link>
              <Link to="/adoption" className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">Browse Pets</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{state.cart.length} {state.cart.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Cart Items</h2>
                <div className="space-y-6">
                  {state.cart.map((cartItem) => {
                    const item = cartItem.item as Record<string, unknown>;
                    return (
                      <div key={cartItem.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img src={item.image as string} alt={item.name as string} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name as string}</h3>
                          <p className="text-gray-600 text-sm">{cartItem.type === 'product' ? 'Product' : 'Pet Adoption'}</p>
                          {item.breed && <p className="text-gray-500 text-sm">{item.breed as string}</p>}
                        </div>
                        <div className="flex items-center space-x-3">
                          <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)} className="p-1 hover:bg-gray-100 rounded transition-colors"><Minus className="w-4 h-4" /></button>
                          <span className="w-8 text-center font-medium">{cartItem.quantity}</span>
                          <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)} className="p-1 hover:bg-gray-100 rounded transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{(getItemPrice(item) * cartItem.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">₹{getItemPrice(item).toFixed(2)} each</p>
                        </div>
                        <button onClick={() => removeItem(cartItem.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-medium">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">GST (18%)</span><span className="font-medium">₹{tax.toFixed(2)}</span></div>
                <div className="border-t pt-4">
                  <div className="flex justify-between"><span className="text-lg font-semibold text-gray-900">Total</span><span className="text-lg font-semibold text-gray-900">₹{total.toFixed(2)}</span></div>
                </div>
              </div>
              {shipping > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-sm">Add ₹{(2999 - subtotal).toFixed(2)} more to get free shipping!</p>
                </div>
              )}
              <button onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 mb-4">
                <span>{state.user ? 'Proceed to Checkout' : 'Login to Checkout'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <div className="text-center">
                <Link to="/store" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">Continue Shopping</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
