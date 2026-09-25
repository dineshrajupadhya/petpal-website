import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ordersAPI, paymentsAPI } from '../services/api';

declare global {
  interface Window { Razorpay: new (options: Record<string, unknown>) => { open: () => void } }
}

export default function Checkout() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('cod');
  const [done, setDone] = useState<string | null>(null);
  const [addr, setAddr] = useState({
    name: state.user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  useEffect(() => {
    paymentsAPI.config()
      .then(res => setRazorpayEnabled(!!res.data.razorpay?.enabled))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!state.user) { navigate('/login'); return; }
    if (state.cart.length === 0 && !done) navigate('/cart');
  }, [state.user, state.cart.length, done, navigate]);

  const getItemPrice = (item: Record<string, unknown>) =>
    (item.price as number) || (item.adoptionFee as number) || 0;

  const subtotal = state.cart.reduce((total, ci) => total + (getItemPrice(ci.item as Record<string, unknown>) * ci.quantity), 0);
  const shipping = subtotal >= 2999 ? 0 : 49;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const validate = () => {
    if (!addr.name || !addr.phone || !addr.street || !addr.city || !addr.state || !addr.zipCode) {
      setError('Please fill in all address fields');
      return false;
    }
    if (!/^\d{10}$/.test(addr.phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    setError('');
    return true;
  };

  const loadRazorpayScript = () =>
    new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const finishOrder = (orderId: string, orderNumber: string) => {
    dispatch({ type: 'CLEAR_CART' });
    setDone(orderNumber || orderId);
  };

  const placeOrder = async () => {
    if (!validate()) return;
    setPlacing(true);
    try {
      const items = state.cart.map(ci => ({
        itemId: ci.id,
        itemType: ci.type as 'product' | 'pet',
        quantity: ci.quantity,
      }));

      const res = await ordersAPI.create({
        items,
        shippingAddress: {
          name: addr.name,
          street: addr.street,
          city: addr.city,
          state: addr.state,
          zipCode: addr.zipCode,
          country: addr.country,
          phone: addr.phone,
        },
        paymentMethod: paymentMethod,
      });

      const order = res.data.order;

      if (paymentMethod === 'cod') {
        finishOrder(order._id, order.orderNumber);
        return;
      }

      // Razorpay flow
      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) {
        setError('Could not load payment gateway. Your order is saved — try paying from profile, or use Cash on Delivery.');
        return;
      }

      const rzpRes = await paymentsAPI.createRazorpayOrder(order._id);
      const { rzpOrderId, amount, currency, keyId } = rzpRes.data;

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: rzpOrderId,
        name: 'PetPal',
        description: `Order ${order.orderNumber}`,
        prefill: { name: addr.name, email: state.user?.email || '', contact: addr.phone },
        theme: { color: '#2563eb' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await paymentsAPI.verifyRazorpay(response);
            finishOrder(order._id, order.orderNumber);
          } catch {
            setError('Payment verification failed. Please contact support with your payment ID.');
          }
        },
        modal: { ondismiss: () => { setPlacing(false); setError('Payment cancelled. Your order is saved as pending.'); } },
      });
      rzp.open();
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(apiErr.response?.data?.message || 'Failed to place order');
      setPlacing(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="bg-white rounded-xl shadow-md p-10">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-1">Order number: <strong>#{done}</strong></p>
            <p className="text-gray-600 mb-6">A confirmation has{razorpayEnabled ? '' : ''} been recorded. You can track it in your profile.</p>
            <div className="flex gap-4 justify-center">
              <Link to="/profile" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">View Orders</Link>
              <Link to="/store" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Enter your delivery details and choose a payment method</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
              {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" value={addr.name} onChange={e => setAddr({ ...addr, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" value={addr.phone} onChange={e => setAddr({ ...addr, phone: e.target.value })} placeholder="10-digit mobile number" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                  <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" value={addr.street} onChange={e => setAddr({ ...addr, street: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" value={addr.city} onChange={e => setAddr({ ...addr, city: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" value={addr.state} onChange={e => setAddr({ ...addr, state: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                  <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" value={addr.zipCode} onChange={e => setAddr({ ...addr, zipCode: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" value={addr.country} disabled />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mr-3" />
                  <Truck className="w-5 h-5 text-gray-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Cash on Delivery</div>
                    <div className="text-sm text-gray-500">Pay when your order arrives</div>
                  </div>
                </label>
                {razorpayEnabled && (
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'razorpay' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="mr-3" />
                    <CreditCard className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Pay Online</div>
                      <div className="text-sm text-gray-500">UPI, Cards, NetBanking via Razorpay</div>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {state.cart.map(ci => {
                  const item = ci.item as Record<string, unknown>;
                  return (
                    <div key={ci.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name as string} × {ci.quantity}</span>
                      <span className="font-medium">₹{(getItemPrice(item) * ci.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-medium">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">GST (18%)</span><span className="font-medium">₹{tax.toFixed(2)}</span></div>
                <div className="flex justify-between border-t pt-3"><span className="text-lg font-semibold text-gray-900">Total</span><span className="text-lg font-semibold text-gray-900">₹{total.toFixed(2)}</span></div>
              </div>
              <button onClick={placeOrder} disabled={placing}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
                {placing ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay ₹' + total.toFixed(2)}
              </button>
              <p className="text-xs text-gray-500 mt-3 text-center">Secure checkout · Free shipping over ₹2,999</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
