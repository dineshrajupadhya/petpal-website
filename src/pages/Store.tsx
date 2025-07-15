import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ShoppingCart, Heart, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export default function Store() {
  const { state, dispatch } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    brand: '',
    rating: ''
  });

  // Mock data
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Premium Dog Food - Chicken & Rice',
        category: 'Food',
        price: 49.99,
        image: 'https://images.pexels.com/photos/4498135/pexels-photo-4498135.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'High-quality dry dog food with real chicken and rice.',
        brand: 'PetNutrition',
        rating: 4.8,
        reviews: 1247,
        inStock: true
      },
      {
        id: '2',
        name: 'Interactive Cat Toy - Feather Wand',
        category: 'Toys',
        price: 15.99,
        image: 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Engaging feather wand toy to keep your cat active and entertained.',
        brand: 'PlayTime',
        rating: 4.6,
        reviews: 892,
        inStock: true
      },
      {
        id: '3',
        name: 'Comfortable Pet Bed - Large',
        category: 'Beds',
        price: 79.99,
        image: 'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Orthopedic pet bed with memory foam for maximum comfort.',
        brand: 'ComfortPet',
        rating: 4.9,
        reviews: 2156,
        inStock: true
      },
      {
        id: '4',
        name: 'Stainless Steel Food Bowl Set',
        category: 'Accessories',
        price: 24.99,
        image: 'https://images.pexels.com/photos/7516354/pexels-photo-7516354.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Durable stainless steel bowls for food and water.',
        brand: 'PetEssentials',
        rating: 4.7,
        reviews: 634,
        inStock: true
      },
      {
        id: '5',
        name: 'Natural Cat Litter - Clumping',
        category: 'Hygiene',
        price: 18.99,
        image: 'https://images.pexels.com/photos/7516542/pexels-photo-7516542.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Eco-friendly clumping cat litter made from natural materials.',
        brand: 'EcoClean',
        rating: 4.5,
        reviews: 1089,
        inStock: true
      },
      {
        id: '6',
        name: 'Adjustable Dog Collar - Leather',
        category: 'Accessories',
        price: 32.99,
        image: 'https://images.pexels.com/photos/7516471/pexels-photo-7516471.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Premium leather collar with adjustable sizing.',
        brand: 'LeatherCraft',
        rating: 4.8,
        reviews: 567,
        inStock: false
      }
    ];
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    if (filters.priceRange) {
      if (filters.priceRange === 'under-25') {
        filtered = filtered.filter(product => product.price < 25);
      } else if (filters.priceRange === '25-50') {
        filtered = filtered.filter(product => product.price >= 25 && product.price <= 50);
      } else if (filters.priceRange === 'over-50') {
        filtered = filtered.filter(product => product.price > 50);
      }
    }

    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(product => product.rating >= minRating);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, filters, products]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const addToCart = (product: Product) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        type: 'product',
        quantity: 1,
        item: product
      }
    });
  };

  const toggleWishlist = (productId: string) => {
    if (state.wishlist.includes(productId)) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: productId });
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      brand: '',
      rating: ''
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pet Store
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything your pet needs - from premium food to fun toys and comfortable accessories.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Toys">Toys</option>
                <option value="Beds">Beds</option>
                <option value="Accessories">Accessories</option>
                <option value="Hygiene">Hygiene</option>
              </select>

              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Prices</option>
                <option value="under-25">Under $25</option>
                <option value="25-50">$25 - $50</option>
                <option value="over-50">Over $50</option>
              </select>

              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Ratings</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>

              <button
                onClick={clearFilters}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      state.wishlist.includes(product.id) 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-gray-600'
                    }`} 
                  />
                </button>
                {!product.inStock && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Out of Stock
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {product.brand}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  
                  <div className="flex space-x-2">
                    <Link
                      to={`/store/${product.id}`}
                      className="px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        product.inStock
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ShoppingCart className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}