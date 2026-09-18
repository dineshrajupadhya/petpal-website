import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Star, Plus, Minus, Truck, Shield, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { productsAPI } from '../services/api';

export default function ProductDetails() {
  const { id } = useParams();
  const { state, dispatch } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    productsAPI.getById(id)
      .then(res => setProduct(res.data.product || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="h-96 bg-gray-200 rounded-xl" />
            <div className="space-y-6">
              <div className="h-10 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/store" className="text-blue-600 hover:text-blue-700">Back to Store</Link>
        </div>
      </div>
    );
  }

  const p = product as Record<string, unknown>;
  const images = (p.images as Array<{ url: string }>) || [];
  const imageUrls = images.length > 0 ? images.map(img => img.url) : [];
  const rating = (p.rating as { average?: number; count?: number }) || {};
  const inventory = (p.inventory as { stock?: number }) || {};
  const specs = (p.specifications || {}) as Record<string, unknown>;
  const features = (p.features || []) as string[];
  const ingredients = (p.ingredients || p.nutritionFacts || []) as string[];
  const isInWishlist = state.wishlist.includes((p._id || p.id) as string);

  const addToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: (p._id || p.id) as string,
        type: 'product',
        quantity,
        item: {
          id: (p._id || p.id) as string,
          name: p.name as string,
          category: p.category as string,
          price: p.price as number,
          image: imageUrls[0] || '',
          description: (p.description as string) || '',
          brand: p.brand as string,
          rating: rating.average || 0,
          inStock: true,
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/store" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />Back to Store
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            {imageUrls.length > 0 ? (
              <>
                <div className="relative">
                  <img src={imageUrls[currentImageIndex]} alt={p.name as string} className="w-full h-96 object-cover rounded-xl" />
                  <button onClick={() => {
                    if (isInWishlist) dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: (p._id || p.id) as string });
                    else dispatch({ type: 'ADD_TO_WISHLIST', payload: (p._id || p.id) as string });
                  }} className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                    <Heart className={`w-6 h-6 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                  </button>
                </div>
                {imageUrls.length > 1 && (
                  <div className="flex space-x-4">
                    {imageUrls.map((image, index) => (
                      <button key={index} onClick={() => setCurrentImageIndex(index)} className={`flex-1 h-20 rounded-lg overflow-hidden border-2 transition-colors ${currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'}`}>
                        <img src={image} alt={`${p.name} ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xl">{(p.name as string)?.[0] || '?'}</div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wide mb-2">{p.brand as string}</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{p.name as string}</h1>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(rating.average || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-gray-600 ml-2">{(rating.average || 0).toFixed(1)} ({rating.count || 0} reviews)</span>
              </div>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">${(p.price as number)?.toFixed(2)}</span>
                {(p.originalPrice as number) && (p.originalPrice as number) > (p.price as number) && (
                  <>
                    <span className="text-xl text-gray-500 line-through">${(p.originalPrice as number)?.toFixed(2)}</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      Save ${((p.originalPrice as number) - (p.price as number)).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">{p.description as string}</p>
            </div>

            <div className="flex items-center space-x-2 mb-6">
              <div className={`w-3 h-3 rounded-full ${(inventory.stock as number || 0) > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`font-medium ${(inventory.stock as number || 0) > 0 ? 'text-green-700' : 'text-red-700'}`}>
                {(inventory.stock as number || 0) > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
              {(inventory.stock as number || 0) > 0 && <span className="text-gray-500">({inventory.stock} available)</span>}
            </div>

            {(inventory.stock as number || 0) > 0 && (
              <>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100 transition-colors" disabled={quantity <= 1}><Minus className="w-4 h-4" /></button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100 transition-colors" disabled={quantity >= (inventory.stock as number || 100)}><Plus className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="space-y-4">
                  <button onClick={addToCart} className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg flex items-center justify-center space-x-2">
                    <ShoppingCart className="w-5 h-5" /><span>Add to Cart - ${((p.price as number || 0) * quantity).toFixed(2)}</span>
                  </button>
                </div>
              </>
            )}

            {features.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <Truck className="w-6 h-6 text-blue-600" />
                <div><div className="font-medium text-gray-900">Free Shipping</div><div className="text-sm text-gray-600">Orders over $35</div></div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <Shield className="w-6 h-6 text-green-600" />
                <div><div className="font-medium text-gray-900">Quality Guarantee</div><div className="text-sm text-gray-600">100% satisfied</div></div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <RotateCcw className="w-6 h-6 text-orange-600" />
                <div><div className="font-medium text-gray-900">Easy Returns</div><div className="text-sm text-gray-600">30-day policy</div></div>
              </div>
            </div>
          </div>
        </div>

        {(Object.keys(specs).length > 0 || ingredients.length > 0) && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.keys(specs).length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="space-y-3">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium text-gray-900">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {ingredients.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h3>
                <ul className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-700">{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
