import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, Clock, Phone, Activity, Eye, Heart } from 'lucide-react';
import { diseasesAPI } from '../services/api';

export default function DiseaseDetails() {
  const { id } = useParams();
  const [disease, setDisease] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    diseasesAPI.getById(id)
      .then(res => setDisease(res.data.disease || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-40 mb-6" />
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!disease) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Disease not found</h2>
          <Link to="/diseases" className="text-blue-600 hover:text-blue-700">Back to Health Guide</Link>
        </div>
      </div>
    );
  }

  const d = disease as Record<string, unknown>;
  const species = (d.species || []) as string[];
  const symptoms = (d.symptoms || []) as Array<{ name: string; description?: string }>;
  const causes = (d.causes || []) as string[];
  const transmission = (d.transmission || []) as string[];
  const diagnosis = (d.diagnosis || []) as Array<{ method?: string; description?: string }>;
  const treatment = (d.treatment || {}) as { immediate?: string[]; medication?: Array<Record<string, string>>; procedures?: string[]; homecare?: string[] };
  const prevention = (d.prevention || []) as string[];
  const whenToSeeVet = (d.whenToSeeVet || []) as string[];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'mild': return <Activity className="w-5 h-5" />;
      case 'moderate': return <Eye className="w-5 h-5" />;
      case 'severe': return <AlertTriangle className="w-5 h-5" />;
      default: return <Heart className="w-5 h-5" />;
    }
  };

  const allTreatments = [...(treatment.immediate || []), ...(treatment.procedures || []), ...(treatment.homecare || [])];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/diseases" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />Back to Health Guide
        </Link>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-bold text-gray-900">{d.name as string}</h1>
            <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getSeverityColor(d.severity as string)}`}>
              {getSeverityIcon(d.severity as string)}<span className="ml-2 capitalize">{d.severity as string}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {species.map((s) => <span key={s} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{s}</span>)}
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">{d.category as string}</span>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">{d.description as string}</p>
        </div>

        {symptoms.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Symptoms to Watch For</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {symptoms.map((symptom, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-gray-800">{symptom.name || symptom}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {whenToSeeVet.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 mb-8">
            <div className="flex items-center mb-4">
              <Phone className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-red-900">When to Contact Your Vet</h2>
            </div>
            <ul className="space-y-2">
              {whenToSeeVet.map((sign, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-red-800">{sign}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {causes.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Common Causes</h3>
              <ul className="space-y-2">
                {causes.map((cause, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {transmission.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How It Spreads</h3>
              <ul className="space-y-2">
                {transmission.map((method, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{method}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {allTreatments.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Treatment Options</h3>
              <ul className="space-y-2">
                {allTreatments.map((t, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {prevention.length > 0 && (
          <div className="bg-green-50 rounded-xl p-6 mt-8">
            <h3 className="text-xl font-bold text-green-900 mb-4">Prevention Tips</h3>
            <ul className="space-y-2">
              {prevention.map((tip, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-green-800">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {d.prognosis && (
          <div className="bg-white rounded-xl shadow-md p-8 mt-8">
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Prognosis & Recovery</h2>
            </div>
            <p className="text-gray-700 text-lg">{d.prognosis as string}</p>
          </div>
        )}
      </div>
    </div>
  );
}
