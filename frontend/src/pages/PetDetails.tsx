import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, CheckCircle, X } from 'lucide-react';
import { petsAPI, adoptionAPI } from '../services/api';
import { useApp } from '../context/AppContext';

export default function PetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useApp();
  const [pet, setPet] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(0);

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', age: '', occupation: '',
    housingType: 'house', ownership: 'own', hasYard: false, landlordAllowsPets: true,
    hasPets: false, currentPets: '', previousPets: '', vetName: '', vetPhone: '',
    hoursAwayFromHome: '', exerciseRoutine: '', travelFrequency: '', someoneHomeOften: true,
    refName: '', refPhone: '', refRelationship: '',
    vetRefName: '', vetRefPhone: '',
    homeVisit: true, followUp: true, returnPolicy: true,
  });

  useEffect(() => {
    if (!id) return;
    petsAPI.getById(id)
      .then(res => setPet(res.data.pet || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const updateForm = (field: string, value: string | boolean) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmitApplication = async () => {
    setSubmitting(true);
    try {
      await adoptionAPI.submit({
        petId: id,
        personalInfo: { fullName: form.fullName, email: form.email, phone: form.phone, age: parseInt(form.age), occupation: form.occupation },
        housing: { type: form.housingType, ownership: form.ownership, hasYard: form.hasYard, landlordAllowsPets: form.landlordAllowsPets },
        experience: { hasPets: form.hasPets, currentPets: form.currentPets, previousPets: form.previousPets, vetName: form.vetName, vetPhone: form.vetPhone },
        lifestyle: { hoursAwayFromHome: form.hoursAwayFromHome, exerciseRoutine: form.exerciseRoutine, travelFrequency: form.travelFrequency, someoneHomeOften: form.someoneHomeOften },
        references: {
          personalReference: { name: form.refName, phone: form.refPhone, relationship: form.refRelationship },
          veterinaryReference: { name: form.vetRefName, phone: form.vetRefPhone }
        },
        agreement: { homeVisit: form.homeVisit, followUp: form.followUp, returnPolicy: form.returnPolicy }
      });
      setApplicationSubmitted(true);
      setShowApplicationForm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit application';
      alert(msg);
    } finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="h-96 bg-gray-200 rounded-xl" />
            <div className="space-y-6"><div className="h-10 bg-gray-200 rounded w-1/2" /><div className="h-4 bg-gray-200 rounded w-3/4" /></div>
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

  const handleStartAdoption = () => {
    if (!state.user) { navigate('/login'); return; }
    setForm(prev => ({ ...prev, fullName: state.user?.name || '', email: state.user?.email || '' }));
    setShowApplicationForm(true);
  };

  const formSteps = ['Personal Info', 'Housing', 'Pet Experience', 'Lifestyle', 'References', 'Agreements'];
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  const renderFormStep = () => {
    switch (formStep) {
      case 0: return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Full Name *</label><input className={inputClass} value={form.fullName} onChange={e => updateForm('fullName', e.target.value)} /></div>
            <div><label className={labelClass}>Email *</label><input type="email" className={inputClass} value={form.email} onChange={e => updateForm('email', e.target.value)} /></div>
            <div><label className={labelClass}>Phone *</label><input className={inputClass} value={form.phone} onChange={e => updateForm('phone', e.target.value)} /></div>
            <div><label className={labelClass}>Age *</label><input type="number" className={inputClass} value={form.age} onChange={e => updateForm('age', e.target.value)} /></div>
            <div className="col-span-2"><label className={labelClass}>Occupation</label><input className={inputClass} value={form.occupation} onChange={e => updateForm('occupation', e.target.value)} /></div>
          </div>
        </div>
      );
      case 1: return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Housing Situation</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Housing Type *</label><select className={inputClass} value={form.housingType} onChange={e => updateForm('housingType', e.target.value)}><option value="house">House</option><option value="apartment">Apartment</option><option value="condo">Condo</option><option value="farm">Farm</option><option value="other">Other</option></select></div>
            <div><label className={labelClass}>Ownership *</label><select className={inputClass} value={form.ownership} onChange={e => updateForm('ownership', e.target.value)}><option value="own">Own</option><option value="rent">Rent</option><option value="living with family">Living with Family</option></select></div>
            <div className="flex items-center space-x-2"><input type="checkbox" checked={form.hasYard} onChange={e => updateForm('hasYard', e.target.checked)} className="rounded" /><span className="text-sm">Has a yard</span></div>
            <div className="flex items-center space-x-2"><input type="checkbox" checked={form.landlordAllowsPets} onChange={e => updateForm('landlordAllowsPets', e.target.checked)} className="rounded" /><span className="text-sm">Landlord allows pets</span></div>
          </div>
        </div>
      );
      case 2: return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Pet Experience</h3>
          <div className="flex items-center space-x-2"><input type="checkbox" checked={form.hasPets} onChange={e => updateForm('hasPets', e.target.checked)} className="rounded" /><span className="text-sm">Currently have pets</span></div>
          {form.hasPets && <div><label className={labelClass}>Current Pets (describe)</label><textarea className={inputClass} rows={2} value={form.currentPets} onChange={e => updateForm('currentPets', e.target.value)} placeholder="e.g. 2 cats, 1 dog" /></div>}
          <div><label className={labelClass}>Previous Pet Experience</label><textarea className={inputClass} rows={2} value={form.previousPets} onChange={e => updateForm('previousPets', e.target.value)} placeholder="Describe your past experience with pets" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Vet Name</label><input className={inputClass} value={form.vetName} onChange={e => updateForm('vetName', e.target.value)} /></div>
            <div><label className={labelClass}>Vet Phone</label><input className={inputClass} value={form.vetPhone} onChange={e => updateForm('vetPhone', e.target.value)} /></div>
          </div>
        </div>
      );
      case 3: return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Lifestyle</h3>
          <div><label className={labelClass}>Hours away from home daily *</label><select className={inputClass} value={form.hoursAwayFromHome} onChange={e => updateForm('hoursAwayFromHome', e.target.value)}><option value="">Select</option><option value="0-2">0-2 hours</option><option value="2-4">2-4 hours</option><option value="4-6">4-6 hours</option><option value="6-8">6-8 hours</option><option value="8+">8+ hours</option></select></div>
          <div><label className={labelClass}>Exercise Routine</label><textarea className={inputClass} rows={2} value={form.exerciseRoutine} onChange={e => updateForm('exerciseRoutine', e.target.value)} placeholder="How active are you? Walks, runs, etc." /></div>
          <div><label className={labelClass}>Travel Frequency</label><select className={inputClass} value={form.travelFrequency} onChange={e => updateForm('travelFrequency', e.target.value)}><option value="">Select</option><option value="rarely">Rarely</option><option value="monthly">Monthly</option><option value="weekly">Weekly</option></select></div>
          <div className="flex items-center space-x-2"><input type="checkbox" checked={form.someoneHomeOften} onChange={e => updateForm('someoneHomeOften', e.target.checked)} className="rounded" /><span className="text-sm">Someone is usually home</span></div>
        </div>
      );
      case 4: return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">References</h3>
          <p className="text-sm text-gray-500">Personal reference (non-family):</p>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelClass}>Name</label><input className={inputClass} value={form.refName} onChange={e => updateForm('refName', e.target.value)} /></div>
            <div><label className={labelClass}>Phone</label><input className={inputClass} value={form.refPhone} onChange={e => updateForm('refPhone', e.target.value)} /></div>
            <div><label className={labelClass}>Relationship</label><input className={inputClass} value={form.refRelationship} onChange={e => updateForm('refRelationship', e.target.value)} /></div>
          </div>
          <p className="text-sm text-gray-500 pt-2">Veterinary reference (if applicable):</p>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Vet/Clinic Name</label><input className={inputClass} value={form.vetRefName} onChange={e => updateForm('vetRefName', e.target.value)} /></div>
            <div><label className={labelClass}>Vet Phone</label><input className={inputClass} value={form.vetRefPhone} onChange={e => updateForm('vetRefPhone', e.target.value)} /></div>
          </div>
        </div>
      );
      case 5: return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Adoption Agreements</h3>
          <label className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
            <input type="checkbox" checked={form.homeVisit} onChange={e => updateForm('homeVisit', e.target.checked)} className="mt-0.5 rounded" />
            <span className="text-sm">I agree to a home visit before/after adoption</span>
          </label>
          <label className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
            <input type="checkbox" checked={form.followUp} onChange={e => updateForm('followUp', e.target.checked)} className="mt-0.5 rounded" />
            <span className="text-sm">I agree to periodic follow-up check-ins</span>
          </label>
          <label className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
            <input type="checkbox" checked={form.returnPolicy} onChange={e => updateForm('returnPolicy', e.target.checked)} className="mt-0.5 rounded" />
            <span className="text-sm">I understand the pet must be returned to the shelter if I can no longer care for it</span>
          </label>
        </div>
      );
    }
  };

  const canProceed = () => {
    switch (formStep) {
      case 0: return form.fullName && form.email && form.phone && form.age;
      case 1: return form.housingType && form.ownership;
      case 2: return true;
      case 3: return form.hoursAwayFromHome;
      case 4: return true;
      case 5: return true;
      default: return true;
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
                  <div className="text-2xl font-bold text-blue-600">₹{p.adoptionFee as number}</div>
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
                {[['Breed', p.breed], ['Age', `${p.age} years`], ['Gender', p.gender], ['Size', p.size], ['Weight', p.weight], ['Color', p.color]].map(([label, val]) => (
                  <div key={label as string}><div className="text-sm text-gray-500">{label}</div><div className="font-medium">{val as string || 'N/A'}</div></div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Health Status</h3>
              <div className="space-y-3">
                {[['Vaccinated', healthInfo.vaccinated], ['Spayed/Neutered', healthInfo.spayedNeutered], ['Microchipped', healthInfo.microchipped], ['House Trained', healthInfo.houseTrained]].map(([label, val]) => (
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
              {applicationSubmitted ? (
                <div className="w-full bg-green-100 text-green-800 py-4 rounded-xl font-semibold text-center text-lg">
                  Application Submitted! We'll review it and get back to you within 2-3 business days.
                </div>
              ) : (
                <button onClick={handleStartAdoption} className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg">
                  Start Adoption Application
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
                    <li key={index} className="flex items-start"><CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" /><span className="text-gray-700">{item}</span></li>
                  ))}
                </ul>
              </div>
            )}
            {requirements.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Adoption Requirements</h3>
                <ul className="space-y-2">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start"><div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0" /><span className="text-gray-700">{req}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Adoption Application Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Adoption Application</h2>
                <p className="text-sm text-gray-500">For {p.name as string} — Step {formStep + 1} of {formSteps.length}</p>
              </div>
              <button onClick={() => setShowApplicationForm(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            <div className="px-6 py-4">
              <div className="flex mb-6">
                {formSteps.map((step, i) => (
                  <div key={i} className="flex-1">
                    <div className={`h-1.5 rounded-full mx-1 ${i <= formStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    <p className={`text-xs mt-1 text-center ${i <= formStep ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{step}</p>
                  </div>
                ))}
              </div>

              {renderFormStep()}

              <div className="flex justify-between mt-8">
                <button onClick={() => setFormStep(prev => Math.max(0, prev - 1))} disabled={formStep === 0} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30">Back</button>
                {formStep < formSteps.length - 1 ? (
                  <button onClick={() => setFormStep(prev => prev + 1)} disabled={!canProceed()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300">Next</button>
                ) : (
                  <button onClick={handleSubmitApplication} disabled={submitting} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300">{submitting ? 'Submitting...' : 'Submit Application'}</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
