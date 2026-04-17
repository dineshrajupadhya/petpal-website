import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Upload, User, Home, Shield, Heart, Mail, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdoptionApplication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    petId: id,
    applicantName: '',
    email: '',
    phone: '',
    address: '',
    householdType: '',
    currentPets: '',
    petPreferences: '',
    experience: '',
    reason: '',
    careCommitment: '',
    vetReference: '',
    backgroundInfo: '',
    photoConsent: false,
    termsAccepted: false
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-8 animate-bounce" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
            Thank you for your adoption application. Our team will review your information within 24-48 hours and contact you via email or phone.
          </p>
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Next Steps</h3>
            <ol className="text-left space-y-2 text-gray-700">
              <li className="flex items-start space-x-3">
                <span className="text-green-500 font-medium mt-1">✓</span>
                <span>Background verification in progress</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-500 font-medium mt-1">→</span>
                <span>Phone interview scheduled</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-500 font-medium mt-1">→</span>
                <span>Meet & greet with pet</span>
              </li>
            </ol>
          </div>
          <Link 
            to="/adoption" 
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-semibold text-lg shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Browse More Pets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={`/adoption/${id}`} className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Pet Details
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-75" />
            <h1 className="text-3xl font-bold mb-2">Adoption Application</h1>
            <p className="text-blue-100 mb-4">Step {step} of 3 - Help us understand your home</p>
            <div className="flex justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-medium">1</div>
                <span>Personal Info</span>
              </div>
              <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-200' : 'text-white/50'}`}>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-medium">2</div>
                <span>Pet Preferences</span>
              </div>
              <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-blue-200' : 'text-white/50'}`}>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-medium">3</div>
                <span>Verification</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 max-w-2xl mx-auto">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">About You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Full Name *
                    </label>
                    <input 
                      name="applicantName" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="Your full name"
                      value={formData.applicantName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email *
                    </label>
                    <input 
                      name="email" 
                      type="email"
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone Number *
                  </label>
                  <input 
                    name="phone" 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    Home Address *
                  </label>
                  <textarea 
                    name="address" 
                    required 
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical" 
                    placeholder="Street address, City, State, ZIP"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Household Type</label>
                    <select name="householdType" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" value={formData.householdType} onChange={handleChange}>
                      <option value="">Select...</option>
                      <option value="single">Single Adult</option>
                      <option value="couple">Couple</option>
                      <option value="family-kids">Family with Kids</option>
                      <option value="family-no-kids">Family no Kids</option>
                      <option value="senior">Senior</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Pets</label>
                    <input 
                      name="currentPets" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="Number and types of current pets"
                      value={formData.currentPets}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <button type="button" onClick={() => setStep(2)} className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-all font-semibold text-lg shadow-lg">
                  Next: Pet Preferences
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Pet Preferences & Experience</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    What pet type are you looking for?
                  </label>
                  <textarea 
                    name="petPreferences" 
                    required 
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical" 
                    placeholder="e.g., Small dog under 2 years old, friendly cat good with kids, energetic breed for active lifestyle..."
                    value={formData.petPreferences}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    Pet ownership experience
                  </label>
                  <textarea 
                    name="experience" 
                    required 
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical" 
                    placeholder="Years of experience, types of pets owned, any training/certifications"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    Why do you want to adopt this pet?
                  </label>
                  <textarea 
                    name="reason" 
                    required 
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical" 
                    placeholder="Tell us why you're excited about adopting. What makes you the perfect match?"
                    value={formData.reason}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button type="button" onClick={() => setStep(1)} className="border border-gray-300 text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition-all font-medium">
                    Previous
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-all font-semibold">
                    Next: Verification
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Background & Commitment Verification</h2>
                <p className="text-gray-600 mb-6">This information helps us ensure the best match between pets and adopters.</p>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Veterinary reference (name/contact)
                  </label>
                  <input 
                    name="vetReference" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="Dr. Smith - (555) 987-6543 or smithvet@clinic.com"
                    value={formData.vetReference}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    Background information & pet history
                  </label>
                  <textarea 
                    name="backgroundInfo" 
                    required 
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical" 
                    placeholder="Any previous pet ownership? Have you ever surrendered a pet? Any animal control incidents? History of evictions for pet violations? Have you ever been convicted of animal cruelty? (Honesty helps us serve you better)"
                    value={formData.backgroundInfo}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-start space-x-3">
                    <input 
                      name="photoConsent" 
                      type="checkbox" 
                      className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      onChange={handleChange}
                    />
                    <span className="text-sm text-gray-700">I consent to home visit photos for verification</span>
                  </label>
                  <label className="flex items-start space-x-3">
                    <input 
                      name="termsAccepted" 
                      type="checkbox" 
                      required
                      className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      onChange={handleChange}
                    />
                    <span className="text-sm text-gray-700">I agree to the adoption terms and understand background verification is required</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button type="button" onClick={() => setStep(2)} className="border border-gray-300 text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition-all font-medium">
                    Previous
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !formData.termsAccepted}
                    className="bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 disabled:bg-gray-400 transition-all font-semibold shadow-lg disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
