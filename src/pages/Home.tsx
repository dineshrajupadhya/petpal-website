import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, ShoppingBag, Stethoscope, MessageCircle, Star, Users, Award } from 'lucide-react';

export default function Home() {
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

  const stats = [
    { icon: Users, number: '10,000+', label: 'Happy Families' },
    { icon: Heart, number: '5,000+', label: 'Pets Adopted' },
    { icon: Star, number: '4.9/5', label: 'Customer Rating' },
    { icon: Award, number: '50+', label: 'Awards Won' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Adopt, Care, and Shop
              <br />
              <span className="text-yellow-300">for Your Pet</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
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

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Pet Lovers Worldwide
            </h2>
            <p className="text-xl text-blue-100">
              Join thousands of happy pet families who trust PetPal
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