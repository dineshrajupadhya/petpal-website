import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Heart, ShoppingBag, MessageCircle, Edit2, Save, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usersAPI, ordersAPI } from '../services/api';

export default function Profile() {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '', address: '' });
  const [orderHistory, setOrderHistory] = useState<Array<Record<string, unknown>>>([]);
  const [adoptionHistory, setAdoptionHistory] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.user) { setLoading(false); return; }
    setProfileData({
      name: state.user.name || '',
      email: state.user.email || '',
      phone: '',
      address: '',
    });

    Promise.allSettled([
      usersAPI.profile(),
      ordersAPI.list({ limit: 10 }),
      usersAPI.adoptions(),
    ]).then(([profileRes, ordersRes, adoptionsRes]) => {
      if (profileRes.status === 'fulfilled') {
        const p = (profileRes.value as { data: Record<string, unknown> }).data;
        const user = (p.user || p) as Record<string, unknown>;
        const addr = (user.address || {}) as Record<string, string>;
        setProfileData({
          name: (user.name as string) || state.user!.name,
          email: (user.email as string) || state.user!.email,
          phone: (user.phone as string) || '',
          address: addr.street ? `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}` : '',
        });
      }
      if (ordersRes.status === 'fulfilled') {
        const od = (ordersRes.value as { data: Record<string, unknown> }).data;
        setOrderHistory(((od.orders || od) as Array<Record<string, unknown>>) || []);
      }
      if (adoptionsRes.status === 'fulfilled') {
        const ad = (adoptionsRes.value as { data: Record<string, unknown> }).data;
        setAdoptionHistory(((ad.adoptions || ad) as Array<Record<string, unknown>>) || []);
      }
    }).finally(() => setLoading(false));
  }, [state.user]);

  const handleSave = () => {
    usersAPI.updateProfile({
      name: profileData.name,
      phone: profileData.phone,
    }).then(() => {
      if (state.user) {
        dispatch({ type: 'SET_USER', payload: { ...state.user, name: profileData.name } });
      }
      setIsEditing(false);
    }).catch(() => {});
  };

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
          <p className="text-xl text-gray-600">Manage your account and view your pet journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-5 h-5" /></button>
                ) : (
                  <div className="flex space-x-2">
                    <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Save className="w-5 h-5" /></button>
                    <button onClick={() => setIsEditing(false)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
                  </div>
                )}
              </div>

              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                {isEditing ? (
                  <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="text-xl font-bold text-gray-900 text-center border-b border-gray-300 focus:border-blue-500 outline-none" />
                ) : (
                  <h3 className="text-xl font-bold text-gray-900">{profileData.name}</h3>
                )}
                <p className="text-gray-600">{state.user.isAdmin ? 'Administrator' : 'Pet Enthusiast'}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{profileData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  {isEditing ? (
                    <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="flex-1 border-b border-gray-300 focus:border-blue-500 outline-none" placeholder="Phone number" />
                  ) : (
                    <span className="text-gray-700">{profileData.phone || 'Not provided'}</span>
                  )}
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <span className="text-gray-700">{profileData.address || 'Not provided'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3"><Heart className="w-5 h-5 text-red-500" /><span className="text-gray-700">Pets Adopted</span></div>
                  <span className="font-semibold text-gray-900">{adoptionHistory.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3"><ShoppingBag className="w-5 h-5 text-blue-500" /><span className="text-gray-700">Orders Placed</span></div>
                  <span className="font-semibold text-gray-900">{orderHistory.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3"><MessageCircle className="w-5 h-5 text-green-500" /><span className="text-gray-700">Support Chats</span></div>
                  <span className="font-semibold text-gray-900">{state.chatMessages.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Adoption History</h2>
              {adoptionHistory.length > 0 ? (
                <div className="space-y-4">
                  {adoptionHistory.map((adoption: Record<string, unknown>, index: number) => {
                    const pet = adoption.petId as Record<string, unknown> | undefined;
                    return (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"><Heart className="w-8 h-8 text-blue-600" /></div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{(pet?.name as string) || 'Pet'}</h3>
                          <p className="text-gray-600">{(pet?.breed as string) || ''}</p>
                          <p className="text-sm text-gray-500">Adopted on {new Date(adoption.adoptedAt as string || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No adoptions yet. Ready to find your perfect companion?</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
              {orderHistory.length > 0 ? (
                <div className="space-y-4">
                  {orderHistory.map((order: Record<string, unknown>, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">#{order.orderNumber as string}</h3>
                        <p className="text-gray-600">{(order.items as unknown[])?.length || 0} items</p>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt as string).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${((order.pricing as Record<string, number>)?.total || 0).toFixed(2)}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>{order.status as string}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No orders yet. Check out our amazing pet products!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
