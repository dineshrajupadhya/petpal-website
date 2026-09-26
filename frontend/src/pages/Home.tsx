import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, ShoppingBag, Stethoscope, MessageCircle, Star, Search, ClipboardCheck, PackageCheck, Clock } from 'lucide-react';
import { petsAPI, productsAPI } from '../services/api';

interface MiniPet {
  id: string;
  name: string;
  breed: string;
  age: number;
  image: string;
  adoptionFee: number;
}

interface MiniProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}

const HERO_IMAGE = 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1600';

export default function Home() {
  const [pets, setPets] = useState<MiniPet[]>([]);
  const [products, setProducts] = useState<MiniProduct[]>([]);
  const [petTotal, setPetTotal] = useState<number | null>(null);
  const [productTotal, setProductTotal] = useState<number | null>(null);

  useEffect(() => {
    petsAPI.list({ status: 'available', limit: 4, sortBy: 'createdAt', sortOrder: 'desc' })
      .then(res => {
        const data: Record<string, unknown>[] = res.data.pets || [];
        setPets(data.map(p => {
          const images = p.images as Array<{ url: string }> | undefined;
          return {
            id: String(p._id || p.id),
            name: String(p.name || ''),
            breed: String(p.breed || ''),
            age: Number(p.age || 0),
            image: images?.[0]?.url || (typeof p.image === 'string' ? p.image : ''),
            adoptionFee: Number(p.adoptionFee || 0),
          };
        }));
        setPetTotal(res.data.pagination?.totalItems ?? data.length);
      })
      .catch(() => {});

    productsAPI.list({ status: 'active', limit: 4, sortBy: 'rating.average', sortOrder: 'desc' })
      .then(res => {
        const data: Record<string, unknown>[] = res.data.products || [];
        setProducts(data.map(p => {
          const images = p.images as Array<{ url: string }> | undefined;
          const rating = p.rating as { average?: number } | undefined;
          return {
            id: String(p._id || p.id),
            name: String(p.name || ''),
            price: Number(p.price || 0),
            image: images?.[0]?.url || (typeof p.image === 'string' ? p.image : ''),
            rating: Number(rating?.average || 0),
          };
        }));
        setProductTotal(res.data.pagination?.totalItems ?? data.length);
      })
      .catch(() => {});
  }, []);

  const features = [
    {
      icon: Heart,
      title: 'Pet Adoption',
      description: 'Find your perfect companion from our loving collection of pets waiting for homes.',
      link: '/adoption',
      color: 'text-red-500'
    },
    {
      icon: ShoppingBag,
      title: 'Pet Store',
      description: 'Shop premium pet supplies, food, toys, and accessories for all your pet needs.',
      link: '/store',
      color: 'text-blue-500'
    },
    {
      icon: Stethoscope,
      title: 'Pet Care',
      description: 'Access comprehensive health information, symptoms checker, and care guides.',
      link: '/diseases',
      color: 'text-green-500'
    },
    {
      icon: MessageCircle,
      title: '24/7 Support',
      description: 'Get instant help from our AI assistant or connect with our expert support team.',
      link: '/chat',
      color: 'text-purple-500'
    }
  ];

  const steps = [
    {
      icon: Search,
      title: 'Browse & Discover',
      description: 'Explore pets looking for homes and premium supplies curated for Indian pet parents.'
    },
    {
      icon: ClipboardCheck,
      title: 'Apply or Order',
      description: 'Submit an adoption application, or check out with COD, UPI, or card — GST included.'
    },
    {
      icon: PackageCheck,
      title: 'Home Sweet Home',
      description: 'Meet your new companion, or get fast doorstep delivery with free shipping over ₹2,999.'
    }
  ];

  const stats = [
    { icon: Heart, number: petTotal !== null ? String(petTotal) : '—', label: 'Pets Waiting for Adoption' },
    { icon: ShoppingBag, number: productTotal !== null ? String(productTotal) : '—', label: 'Products in Our Store' },
    { icon: MessageCircle, number: '24/7', label: 'Instant AI Support' },
    { icon: Clock, number: '1 Day', label: 'Support Reply Time' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Two happy golden retriever puppies"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-purple-900/75 to-pink-900/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
              Adopt, Care, and Shop
              <br />
              <span className="text-yellow-300">for Your Pet</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Your complete pet care platform. Find loving companions, premium supplies,
              and expert care guidance all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/adoption"
                className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Adopting
              </Link>
              <Link
                to="/store"
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything Your Pet Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From finding the perfect companion to comprehensive care, we're here for every step of your pet journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-center space-y-4">
                  <div className={`inline-flex p-4 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors ${feature.color}`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700 transition-colors">
                    <span className="font-medium">Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      {pets.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Pets Looking for Homes</h2>
                <p className="text-xl text-gray-600">Real companions from shelters, waiting to meet you.</p>
              </div>
              <Link to="/adoption" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 shrink-0">
                View All Pets <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pets.map(pet => (
                <Link key={pet.id} to={`/adoption/${pet.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    {pet.image && <img src={pet.image} alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">{pet.name}</h3>
                      <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-full shrink-0">{pet.age} {pet.age === 1 ? 'yr' : 'yrs'}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{pet.breed}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm font-semibold text-green-600">{pet.adoptionFee > 0 ? `Fee ₹${pet.adoptionFee}` : 'Free Adoption'}</span>
                      <span className="text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">View →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {products.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Customer Favourites</h2>
                <p className="text-xl text-gray-600">Top-rated supplies loved by pet parents.</p>
              </div>
              <Link to="/store" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 shrink-0">
                Shop All <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <Link key={product.id} to={`/store/${product.id}`} className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1">{product.rating > 0 ? product.rating.toFixed(1) : 'New'}</span>
                    </div>
                    <div className="mt-3 text-xl font-bold text-gray-900">₹{product.price.toFixed(2)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How PetPal Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Three simple steps to your next best friend or your pet's new favourite thing.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative bg-white p-8 rounded-2xl shadow-sm text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="inline-flex p-4 rounded-full bg-blue-50 text-blue-600 mb-4 mt-2">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Pet Lovers Across India
            </h2>
            <p className="text-xl text-blue-100">
              Join happy pet families across India who trust PetPal
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex p-4 bg-blue-500 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Pet?
          </h2>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Start your pet journey today. Browse our available pets, shop for supplies,
            or get expert advice from our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/adoption"
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Browse Pets
            </Link>
            <Link
              to="/chat"
              className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              Get Help
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
