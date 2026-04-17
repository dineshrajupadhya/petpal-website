import React, { useState } from 'react';
import { Users, Heart, ShoppingBag, MessageCircle, Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data
  const stats = [
    { icon: Users, label: 'Total Users', value: '2,847', change: '+12%' },
    { icon: Heart, label: 'Pets Adopted', value: '1,234', change: '+8%' },
    { icon: ShoppingBag, label: 'Orders', value: '5,678', change: '+15%' },
    { icon: MessageCircle, label: 'Support Tickets', value: '89', change: '-5%' }
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', joined: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', joined: '2024-01-14', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', joined: '2024-01-13', status: 'Pending' }
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', total: 89.97, status: 'Completed', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Jane Smith', total: 45.99, status: 'Processing', date: '2024-01-15' },
    { id: 'ORD-003', customer: 'Mike Johnson', total: 156.50, status: 'Shipped', date: '2024-01-14' }
  ];

  const pets = [
    { id: 1, name: 'Buddy', species: 'Dog', breed: 'Golden Retriever', status: 'Available' },
    { id: 2, name: 'Luna', species: 'Cat', breed: 'Persian', status: 'Adopted' },
    { id: 3, name: 'Charlie', species: 'Dog', breed: 'Labrador Mix', status: 'Available' }
  ];

  const products = [
    { id: 1, name: 'Premium Dog Food', category: 'Food', price: 49.99, stock: 25 },
    { id: 2, name: 'Cat Toy Set', category: 'Toys', price: 15.99, stock: 50 },
    { id: 3, name: 'Pet Bed', category: 'Accessories', price: 79.99, stock: 12 }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${order.total}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPets = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Pets</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Pet</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Breed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pets.map((pet) => (
              <tr key={pet.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{pet.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{pet.species}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{pet.breed}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pet.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {pet.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Products</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">${product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.stock > 20 ? 'bg-green-100 text-green-800' :
                    product.stock > 10 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.stock} in stock
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Users },
    { id: 'pets', label: 'Pets', icon: Heart },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'support', label: 'Support', icon: MessageCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your PetPal platform</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-md p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'pets' && renderPets()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'users' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2>
                <p className="text-gray-600">User management features coming soon...</p>
              </div>
            )}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Management</h2>
                <p className="text-gray-600">Order management features coming soon...</p>
              </div>
            )}
            {activeTab === 'support' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Support Tickets</h2>
                <p className="text-gray-600">Support ticket management coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}