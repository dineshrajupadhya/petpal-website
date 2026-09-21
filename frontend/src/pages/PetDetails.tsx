import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Calendar, Users, CheckCircle, Phone, Mail } from 'lucide-react';
import { petsAPI } from '../services/api';
import { useApp } from '../context/AppContext';

export default function PetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useApp();
  const [pet, setPet] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    if (!id) return;
    petsAPI.getById(id)
      .then(res => setPet(res.data.pet || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="h-96 bg-gray-200 rounded-xl" />
            </div>
            <div className="space-y-6">
              <div className="h-10 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pet not found</h2>
          <Link to="/adoption" className="text-blue-600 hover:text-blue-700">Back to Adoption</Link>
        </div>
      </div>
    );
  }

  const p = pet as Record<string, unknown>;
  const images = (p.images as Array<{ url: string }>) || [];
  const imageUrls = images.length > 0 ? images.map(img => img.url) : (p.image ? [p.image as string] : []);
  const healthInfo = (p.healthInfo || {}) as Record<string, boolean>;
  const loc = (p.location || {}) as Record<string, string>;
  const personality = (p.personality || []) as string[];
  const medHistory = (p.healthInfo as { medicalHistory?: string[] })?.medicalHistory || [];
  const requirements = (p.adoptionRequirements || []) as string[];

  const handleAdopt = async () => {
    if (!state.user) {
      navigate('/login');
      return;
    }
    try {
      await petsAPI.inquire(id!, `I'm interested in adopting ${p.name}`);
      setInquirySent(true);
    } catch {
      alert('Failed to submit inquiry. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/adoption" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />Back to Adoption
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative">
              {imageUrls.length > 0 ? (
                <img src={imageUrls[currentImageIndex]} alt={p.name as string} className="w-full h-96 object-cover rounded-xl" />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xl">{(p.name as string)?.[0] || '?'}</div>
              )}
              <button className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-6 h-6 text-gray-600" />
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
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl font-bold text-gray-900">{p.name as string}</h1>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">${p.adoptionFee as number}</div>
                  <div className="text-sm text-gray-500">Adoption Fee</div>
                </div>
              </div>
              {personality.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {personality.map((trait, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{trait}</span>
                  ))}
                </div>
              )}
              <p className="text-gray-700 leading-relaxed">{p.description as string}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Breed', p.breed], ['Age', `${p.age} years`], ['Gender', p.gender], ['Size', p.size],
                  ['Weight', p.weight], ['Color', p.color]
                ].map(([label, val]) => (
                  <div key={label as string}>
                    <div className="text-sm text-gray-500">{label}</div>
                    <div className="font-medium">{val as string || 'N/A'}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Health Status</h3>
              <div className="space-y-3">
                {[
                  ['Vaccinated', healthInfo.vaccinated],
                  ['Spayed/Neutered', healthInfo.spayedNeutered],
                  ['Microchipped', healthInfo.microchipped],
                  ['House Trained', healthInfo.houseTrained],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex items-center">
                    <CheckCircle className={`w-5 h-5 mr-3 ${val ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={val ? 'text-gray-700' : 'text-gray-400'}>{label as string}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                  {loc.city && loc.state ? `${loc.city}, ${loc.state}` : (p.location as string) || 'N/A'}
                </div>
                {loc.shelter && <div className="text-gray-600">{loc.shelter}</div>}
              </div>
            </div>

            <div className="space-y-4">
              {inquirySent ? (
                <div className="w-full bg-green-100 text-green-800 py-4 rounded-xl font-semibold text-center text-lg">
                  Inquiry Sent! We'll get back to you soon.
                </div>
              ) : (
                <button onClick={handleAdopt} className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg">
                  Start Adoption Process
                </button>
              )}
            </div>
          </div>
        </div>

        {(medHistory.length > 0 || requirements.length > 0) && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {medHistory.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Medical History</h3>
                <ul className="space-y-2">
                  {medHistory.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {requirements.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Adoption Requirements</h3>
                <ul className="space-y-2">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{req}</span>
                    </li>
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
