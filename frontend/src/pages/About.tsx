import React from 'react';
import { Heart, Users, Shield, Sparkles } from 'lucide-react';

export default function About() {
  const values = [
    { icon: Heart, title: 'Compassion First', desc: 'Every pet deserves a loving home. Our adoption process puts animal welfare above all.' },
    { icon: Shield, title: 'Trust & Safety', desc: 'Verified sellers, transparent health records, and secure payments protect every transaction.' },
    { icon: Users, title: 'Community', desc: 'We connect pet lovers, shelters, and responsible breeders across India.' },
    { icon: Sparkles, title: 'Quality Care', desc: 'Curated products and expert health guidance to keep your companions thriving.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About PetPal</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            PetPal is India's complete pet care platform — bringing together pet adoption,
            a trusted store, and expert health guidance in one place.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              PetPal started with a simple observation: adopting a pet in India is harder than it should be,
              and finding trustworthy pet products is even harder. Shelters are full, information is scattered,
              and pet parents often don't know where to turn when their companion falls ill.
            </p>
            <p>
              We built PetPal to fix that. Our platform connects loving families with pets in need of homes,
              offers a curated store of quality supplies, and provides an AI-powered health assistant
              for everyday pet care questions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {values.map((v, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <v.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{v.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-600 rounded-xl shadow-md p-8 text-center text-white">
          <h2 className="text-2xl font-semibold mb-3">Ready to find your new companion?</h2>
          <p className="text-blue-100 mb-6">Browse available pets or shop supplies for your furry family.</p>
          <div className="flex gap-4 justify-center">
            <a href="/adoption" className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">Adopt a Pet</a>
            <a href="/store" className="px-6 py-3 border border-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Visit Store</a>
          </div>
        </div>
      </div>
    </div>
  );
}
