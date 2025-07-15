import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Heart, ShoppingBag, MessageCircle, Edit2, Save, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const { state } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    address: '123 Pet Street, Animal City, PC 12345',
    bio: 'Pet lover and advocate for animal welfare. Proud owner of 2 dogs and 1 cat.'
  });

  const handleSave = () => {
    // In a real app, this would update the user profile
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
  };

  // Mock data for user activity
  const adoptionHistory = [
    {
      id: '1',
      petName: 'Max',
      breed: 'Golden Retriever',
      adoptedDate: '2023-06-15',
      image: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '2',
      petName: 'Luna',
      breed: 'Persian Cat',
      adoptedDate: '2023-03-22',
      image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=200'
    }
  ];

  const orderHistory = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      total: 89.97,
      status: 'Delivered',
      items: 3
    },
    {
      id: 'ORD-002',
      date: '2024-01-08',
      total: 45.99,
      status: 'Delivered',
      items: 2
    },
    {
      id: 'ORD-003',
      date: '2023-12-20',
      total: 156.50,
      status: 'Delivered',
      items: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Profile
          </h1>
          <p className="text-xl text-gray-600">
            Manage your account and view your pet journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="text-xl font-bold text-gray-900 text-center border-b border-gray-300 focus:border-blue-500 outline-none"
                  />
                ) : (
                  <h3 className="text-xl font-bold text-gray-900">{editedProfile.name}</h3>
                )}
                <p className="text-gray-600">Pet Enthusiast</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                      className="flex-1 border-b border-gray-300 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <span className="text-gray-700">{editedProfile.email}</span>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                      className="flex-1 border-b border-gray-300 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <span className="text-gray-700">{editedProfile.phone}</span>
                  )}
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  {isEditing ? (
                    <textarea
                      value={editedProfile.address}
                      onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                      className="flex-1 border-b border-gray-300 focus:border-blue-500 outline-none resize-none"
                      rows={2}
                    />
                  ) : (
                    <span className="text-gray-700">{editedProfile.address}</span>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-gray-900 mb-2">About Me</h4>
                {isEditing ? (
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-600 text-sm">{editedProfile.bio}</p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700">Pets Adopted</span>
                  </div>
                  <span className="font-semibold text-gray-900">{adoptionHistory.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Orders Placed</span>
                  </div>
                  <span className="font-semibold text-gray-900">{orderHistory.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Support Chats</span>
                  </div>
                  <span className="font-semibold text-gray-900">{state.chatMessages.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity History */}
          <div className="lg:col-span-2 space-y-8">
            {/* Adoption History */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Adoption History</h2>
              {adoptionHistory.length > 0 ? (
                <div className="space-y-4">
                  {adoptionHistory.map((adoption) => (
                    <div key={adoption.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={adoption.image}
                        alt={adoption.petName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{adoption.petName}</h3>
                        <p className="text-gray-600">{adoption.breed}</p>
                        <p className="text-sm text-gray-500">
                          Adopted on {new Date(adoption.adoptedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Heart className="w-6 h-6 text-red-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No adoptions yet. Ready to find your perfect companion?</p>
                </div>
              )}
            </div>

            {/* Order History */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
              {orderHistory.length > 0 ? (
                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                        <p className="text-gray-600">{order.items} items</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${order.total}</p>
                        <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          {order.status}
                        </span>
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

            {/* Wishlist */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Wishlist</h2>
              {state.wishlist.length > 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-600">{state.wishlist.length} items in your wishlist</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Your wishlist is empty. Start adding items you love!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}