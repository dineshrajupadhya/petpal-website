import React, { useState, useEffect } from 'react';
import { Users, Heart, ShoppingBag, MessageCircle, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { adminAPI } from '../services/api';

export default function Admin() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.user?.isAdmin) { setLoading(false); return; }
    adminAPI.dashboard()
      .then(res => setDashboardData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [state.user]);

  if (!state.user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Login as admin@petpal.com / admin123</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData ? [
    { icon: Users, label: 'Total Users', value: (dashboardData.stats as Record<string, number>)?.users || 0 },
    { icon: Heart, label: 'Total Pets', value: (dashboardData.stats as Record<string, number>)?.pets || 0 },
    { icon: ShoppingBag, label: 'Total Orders', value: (dashboardData.stats as Record<string, number>)?.orders || 0 },
    { icon: MessageCircle, label: 'Active Chats', value: (dashboardData.stats as Record<string, number>)?.chats || 0 },
  ] : [];

  const recentOrders = (dashboardData?.recentOrders || []) as Array<Record<string, unknown>>;
  const recentUsers = (dashboardData?.recentUsers || []) as Array<Record<string, unknown>>;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Users },
    { id: 'pets', label: 'Pets', icon: Heart },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full"><stat.icon className="w-6 h-6 text-blue-600" /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
          <div className="space-y-3">
            {recentUsers.length > 0 ? recentUsers.map((user: Record<string, unknown>, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{user.name as string}</p>
                  <p className="text-sm text-gray-600">{user.email as string}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${(user.isActive as boolean) !== false ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {(user.isActive as boolean) !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
            )) : <p className="text-gray-500">No users yet</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.length > 0 ? recentOrders.map((order: Record<string, unknown>, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">#{order.orderNumber as string}</p>
                  <p className="text-sm text-gray-600">{((order.pricing as Record<string, number>)?.total || 0).toFixed(2)}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>{order.status as string}</span>
              </div>
            )) : <p className="text-gray-500">No orders yet</p>}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your PetPal platform</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-md p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <tab.icon className="w-5 h-5" /><span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-4 gap-6">
                  {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'pets' && (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold text-gray-900">Manage Pets</h2>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"><Plus className="w-5 h-5" /><span>Add Pet</span></button>
                    </div>
                    <p className="text-gray-600">Pet management is available through the Adoption page for adding/editing pets.</p>
                  </div>
                )}
                {activeTab === 'products' && (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold text-gray-900">Manage Products</h2>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"><Plus className="w-5 h-5" /><span>Add Product</span></button>
                    </div>
                    <p className="text-gray-600">Product management is available through the Store page for adding/editing products.</p>
                  </div>
                )}
                {activeTab === 'orders' && (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Management</h2>
                    {recentOrders.length > 0 ? (
                      <div className="space-y-3">
                        {recentOrders.map((order: Record<string, unknown>, index: number) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                            <div>
                              <p className="font-semibold text-gray-900">#{order.orderNumber as string}</p>
                              <p className="text-sm text-gray-600">Total: ${((order.pricing as Record<string, number>)?.total || 0).toFixed(2)}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>{order.status as string}</span>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-gray-500">No orders yet</p>}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
