import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { productsAPI } from '../services/api';

export default function Store() {
  const { dispatch } = useApp();
  const [products, setProducts] = useState<Array<Record<string, unknown>>>([]);
  const [filteredProducts, setFilteredProducts] = useState<Array<Record<string, unknown>>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', priceRange: '', brand: '' });

  useEffect(() => {
    productsAPI.list({ status: 'active', limit: 50 })
      .then(res => {
        const data = res.data.products || res.data.data || res.data || [];
        setProducts(Array.isArray(data) ? data : []);
        setFilteredProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter(p =>
        (p.name as string)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.brand as string)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category as string)?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filters.category) filtered = filtered.filter(p => p.category === filters.category);
    if (filters.brand) filtered = filtered.filter(p => p.brand === filters.brand);
    setFilteredProducts(filtered);
  }, [searchTerm, filters, products]);

  const clearFilters = () => {
    setFilters({ category: '', priceRange: '', brand: '' });
    setSearchTerm('');
  };

  const getPrimaryImage = (p: Record<string, unknown>) => {
    const images = p.images as Array<{ url: string; isPrimary: boolean }> | undefined;
    if (images && images.length > 0) return images[0].url;
    return p.image as string || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pet Supplies Store</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything your pet needs, from premium food to toys and accessories.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="flex flex-wrap gap-3">
              <select value={filters.category} onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Toys">Toys</option>
                <option value="Beds">Beds</option>
                <option value="Accessories">Accessories</option>
                <option value="Hygiene">Hygiene</option>
                <option value="Health">Health</option>
              </select>
              <button onClick={clearFilters} className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors">Clear Filters</button>
            </div>
          </div>
        </div>

        <div className="mb-6"><p className="text-gray-600">Showing {filteredProducts.length} products</p></div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const rating = (product.rating as { average?: number; count?: number }) || {};
              const inventory = (product.inventory as { stock?: number }) || {};
              return (
                <div key={product._id || product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img src={getPrimaryImage(product)} alt={product.name as string} className="w-full h-48 object-cover" />
                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                    {(product.originalPrice as number) && (product.originalPrice as number) > (product.price as number) && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        -{Math.round((1 - (product.price as number) / (product.originalPrice as number)) * 100)}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.brand as string}</div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name as string}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-gray-600 ml-1">{(rating.average as number || 0).toFixed(1)} ({rating.count as number || 0})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">${(product.price as number)?.toFixed(2)}</span>
                        {(product.originalPrice as number) && (product.originalPrice as number) > (product.price as number) && (
                          <span className="text-sm text-gray-500 line-through">${(product.originalPrice as number)?.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center text-sm">
                      <div className={`w-2 h-2 rounded-full mr-2 ${(inventory.stock as number || 0) > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className={(inventory.stock as number || 0) > 0 ? 'text-green-700' : 'text-red-700'}>
                        {(inventory.stock as number || 0) > 0 ? `${inventory.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link to={`/store/${product._id || product.id}`} className="flex-1 block bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        View Details
                      </Link>
                      {(inventory.stock as number || 0) > 0 && (
                        <button onClick={() => {
                          const images = product.images as Array<{ url: string }> | undefined;
                          dispatch({
                            type: 'ADD_TO_CART',
                            payload: {
                              id: (product._id || product.id) as string,
                              type: 'product',
                              quantity: 1,
                              item: {
                                id: (product._id || product.id) as string,
                                name: product.name as string,
                                category: product.category as string,
                                price: product.price as number,
                                image: images?.[0]?.url || '',
                                description: product.description as string || '',
                                brand: product.brand as string,
                                rating: (product.rating as { average?: number })?.average || 0,
                                inStock: true,
                              }
                            }
                          });
                        }} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
            <button onClick={clearFilters} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Clear All Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
