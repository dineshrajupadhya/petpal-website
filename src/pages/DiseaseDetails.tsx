import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, Clock, Phone, Activity, Eye, Heart } from 'lucide-react';

export default function DiseaseDetails() {
  const { id } = useParams();

  // Mock data - in a real app, this would be fetched based on the ID
  const disease = {
    id: '1',
    name: 'Kennel Cough',
    species: ['Dog'],
    symptoms: ['Persistent dry cough', 'Gagging', 'Retching', 'Nasal discharge', 'Mild fever', 'Loss of appetite'],
    description: 'Kennel cough, also known as canine infectious tracheobronchitis, is a highly contagious respiratory infection that affects dogs. It\'s characterized by inflammation of the upper respiratory system, particularly the trachea and bronchi.',
    severity: 'mild',
    category: 'Respiratory',
    causes: [
      'Bordetella bronchiseptica bacteria',
      'Canine parainfluenza virus',
      'Canine adenovirus',
      'Canine respiratory coronavirus',
      'Mycoplasma species'
    ],
    transmission: [
      'Airborne droplets from coughing or sneezing',
      'Direct contact with infected dogs',
      'Contaminated surfaces (food bowls, toys)',
      'Crowded conditions (kennels, dog parks)'
    ],
    diagnosis: [
      'Physical examination by veterinarian',
      'Review of symptoms and medical history',
      'Chest X-rays if complications suspected',
      'Laboratory tests for specific pathogens',
      'Bronchoscopy in severe cases'
    ],
    treatment: [
      'Rest and isolation from other dogs',
      'Cough suppressants for comfort',
      'Antibiotics if bacterial infection present',
      'Bronchodilators for severe cases',
      'Supportive care with fluids and nutrition'
    ],
    prevention: [
      'Vaccination (Bordetella vaccine)',
      'Avoid crowded dog areas during outbreaks',
      'Maintain good hygiene and clean environment',
      'Ensure proper ventilation in kennels',
      'Regular veterinary check-ups'
    ],
    prognosis: 'Most dogs recover completely within 1-3 weeks with proper care',
    whenToSeeVet: [
      'Persistent cough lasting more than a week',
      'Difficulty breathing or labored breathing',
      'Loss of appetite for more than 24 hours',
      'Lethargy or unusual behavior',
      'Thick, colored nasal discharge',
      'High fever (over 103°F)'
    ],
    homeCareTips: [
      'Provide a quiet, comfortable resting area',
      'Use a humidifier to ease breathing',
      'Ensure access to fresh water',
      'Offer soft, easy-to-swallow food',
      'Limit exercise and excitement',
      'Monitor symptoms and temperature'
    ]
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'mild':
        return <Activity className="w-5 h-5" />;
      case 'moderate':
        return <Eye className="w-5 h-5" />;
      case 'severe':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/diseases"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Health Guide
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-bold text-gray-900">{disease.name}</h1>
            <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getSeverityColor(disease.severity)}`}>
              {getSeverityIcon(disease.severity)}
              <span className="ml-2 capitalize">{disease.severity}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {disease.species.map((species) => (
              <span
                key={species}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {species}
              </span>
            ))}
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {disease.category}
            </span>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed">{disease.description}</p>
        </div>

        {/* Symptoms */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Symptoms to Watch For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {disease.symptoms.map((symptom, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-gray-800">{symptom}</span>
              </div>
            ))}
          </div>
        </div>

        {/* When to See a Vet */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 mb-8">
          <div className="flex items-center mb-4">
            <Phone className="w-6 h-6 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-red-900">When to Contact Your Vet</h2>
          </div>
          <p className="text-red-800 mb-4">
            Contact your veterinarian immediately if you notice any of these signs:
          </p>
          <ul className="space-y-2">
            {disease.whenToSeeVet.map((sign, index) => (
              <li key={index} className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-red-800">{sign}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Causes */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Common Causes</h3>
            <ul className="space-y-2">
              {disease.causes.map((cause, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{cause}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Transmission */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">How It Spreads</h3>
            <ul className="space-y-2">
              {disease.transmission.map((method, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{method}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Diagnosis */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Diagnosis Methods</h3>
            <ul className="space-y-2">
              {disease.diagnosis.map((method, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{method}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Treatment */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Treatment Options</h3>
            <ul className="space-y-2">
              {disease.treatment.map((treatment, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{treatment}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Prevention & Home Care */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Prevention */}
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-900 mb-4">Prevention Tips</h3>
            <ul className="space-y-2">
              {disease.prevention.map((tip, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-green-800">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Home Care */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Home Care Tips</h3>
            <ul className="space-y-2">
              {disease.homeCareTips.map((tip, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Heart className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-800">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Prognosis */}
        <div className="bg-white rounded-xl shadow-md p-8 mt-8">
          <div className="flex items-center mb-4">
            <Clock className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Prognosis & Recovery</h2>
          </div>
          <p className="text-gray-700 text-lg">{disease.prognosis}</p>
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-8">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Emergency Veterinary Care
              </h3>
              <p className="text-red-800 text-sm leading-relaxed mb-4">
                If your pet is experiencing difficulty breathing, collapse, or any life-threatening symptoms, 
                seek emergency veterinary care immediately. Don't wait for regular office hours.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/chat"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Get Help Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}