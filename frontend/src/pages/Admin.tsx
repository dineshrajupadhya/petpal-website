import React, { useState, useEffect } from 'react';
import { Users, Heart, ShoppingBag, MessageCircle, Eye, CheckCircle, XCircle, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { adminAPI, petsAPI, productsAPI, ordersAPI } from '../services/api';

export default function Admin() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const [pets, setPets] = useState<Array<Record<string, unknown>>>([]);
  const [products, setProducts] = useState<Array<Record<string, unknown>>>([]);
  const [orders, setOrders] = useState<Array<Record<string, unknown>>>([]);
  const [tabLoading, setTabLoading] = useState(false);

  useEffect(() => {
    if (!state.user?.isAdmin) { setLoading(false); return; }
    adminAPI.dashboard()
      .then(res => setDashboardData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [state.user]);

  const loadTab = (tab: string) => {
    setTabLoading(true);
    const token = localStorage.getItem('petpal_token');
    const headers = { Authorization: `Bearer ${token}` };

    if (tab === 'pets') {
      petsAPI.list({ limit: 50 })
        .then(res => setPets(res.data.pets || res.data.data || []))
        .catch(() => {})
        .finally(() => setTabLoading(false));
    } else if (tab === 'products') {
      productsAPI.list({ limit: 50 })
        .then(res => setProducts(res.data.products || res.data.data || []))
        .catch(() => {})
        .finally(() => setTabLoading(false));
    } else if (tab === 'orders') {
      ordersAPI.adminAll({ limit: 50 })
        .then(res => setOrders(res.data.orders || []))
        .catch(() => {})
        .finally(() => setTabLoading(false));
    } else {
      setTabLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await ordersAPI.updateStatus(orderId, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch { alert('Failed to update order status'); }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'dashboard') loadTab(tab);
  };

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
    { icon: Users, label: 'Total Users', value: ((dashboardData.stats as Record<string, Record<string, number>>)?.users?.total) ?? 0 },
    { icon: Heart, label: 'Total Pets', value: ((dashboardData.stats as Record<string, Record<string, number>>)?.pets?.total) ?? 0 },
    { icon: ShoppingBag, label: 'Total Orders', value: ((dashboardData.stats as Record<string, Record<string, number>>)?.orders?.total) ?? 0 },
    { icon: MessageCircle, label: 'Active Chats', value: ((dashboardData.stats as Record<string, Record<string, number>>)?.chats?.total) ?? 0 },
  ] : [];

  const recentOrders = ((dashboardData as Record<string, Record<string, unknown>>)?.recentActivity?.orders || []) as Array<Record<string, unknown>>;
  const recentUsers = ((dashboardData as Record<string, Record<string, unknown>>)?.recentActivity?.users || []) as Array<Record<string, unknown>>;

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
                  <p className="text-sm text-gray-600">${((order.pricing as Record<string, number>)?.total || 0).toFixed(2)}</p>
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

  const renderPets = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Pets</h2>
      {tabLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />)}</div>
      ) : pets.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No pets found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 font-semibold text-gray-700">Pet</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Species</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Breed</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Age</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Fee</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet, i) => {
                const images = (pet.images as Array<{ url: string }>) || [];
                return (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        {images[0] && <img src={images[0].url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                        <span className="font-medium">{pet.name as string}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{pet.species as string}</td>
                    <td className="py-3 px-4 text-gray-600">{pet.breed as string}</td>
                    <td className="py-3 px-4 text-gray-600">{pet.age as number} yr</td>
                    <td className="py-3 px-4 text-gray-600">${pet.adoptionFee as number}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pet.status === 'available' ? 'bg-green-100 text-green-800' :
                        pet.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>{pet.status as string}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderProducts = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Products</h2>
      {tabLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />)}</div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No products found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 font-semibold text-gray-700">Product</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Brand</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Price</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Stock</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Rating</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod, i) => {
                const images = (prod.images as Array<{ url: string }>) || [];
                const stock = (prod.inventory as Record<string, number>)?.stock ?? 0;
                const rating = (prod.rating as Record<string, number>)?.average ?? 0;
                return (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        {images[0] && <img src={images[0].url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                        <span className="font-medium">{prod.name as string}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{prod.category as string}</td>
                    <td className="py-3 px-4 text-gray-600">{prod.brand as string}</td>
                    <td className="py-3 px-4 text-gray-600">${prod.price as number}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${stock < 10 ? 'text-red-600' : 'text-green-600'}`}>{stock}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{rating > 0 ? `${rating} ★` : 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Management</h2>
      {tabLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const user = order.userId as Record<string, string> | undefined;
            const pricing = order.pricing as Record<string, number> | undefined;
            const items = (order.items || []) as Array<Record<string, unknown>>;
            return (
              <div key={i} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">#{order.orderNumber as string}</p>
                    <p className="text-sm text-gray-600">
                      Customer: {user?.name || 'Unknown'} ({user?.email || ''})
                    </p>
                    <p className="text-sm text-gray-600">
                      {items.length} item(s) — Total: ${pricing?.total?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(order.createdAt as string).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select
                      value={order.status as string}
                      onChange={(e) => updateOrderStatus(order._id as string, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
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
                  <button key={tab.id} onClick={() => handleTabChange(tab.id)}
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
                {activeTab === 'pets' && renderPets()}
                {activeTab === 'products' && renderProducts()}
                {activeTab === 'orders' && renderOrders()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
