import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, AlertTriangle, Heart, Eye, Thermometer, Activity } from 'lucide-react';

interface Disease {
  id: string;
  name: string;
  species: string[];
  symptoms: string[];
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  category: string;
}

export default function Diseases() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [filteredDiseases, setFilteredDiseases] = useState<Disease[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState('');

  // Mock data
  useEffect(() => {
    const mockDiseases: Disease[] = [
      {
        id: '1',
        name: 'Kennel Cough',
        species: ['Dog'],
        symptoms: ['Persistent cough', 'Gagging', 'Retching', 'Nasal discharge'],
        description: 'A highly contagious respiratory infection that affects dogs.',
        severity: 'mild',
        category: 'Respiratory'
      },
      {
        id: '2',
        name: 'Feline Upper Respiratory Infection',
        species: ['Cat'],
        symptoms: ['Sneezing', 'Runny nose', 'Eye discharge', 'Lethargy'],
        description: 'Common viral or bacterial infection affecting cats\' upper respiratory system.',
        severity: 'moderate',
        category: 'Respiratory'
      },
      {
        id: '3',
        name: 'Hip Dysplasia',
        species: ['Dog', 'Cat'],
        symptoms: ['Limping', 'Difficulty rising', 'Reduced activity', 'Joint stiffness'],
        description: 'Genetic condition affecting the hip joint formation.',
        severity: 'severe',
        category: 'Musculoskeletal'
      },
      {
        id: '4',
        name: 'Feline Diabetes',
        species: ['Cat'],
        symptoms: ['Excessive urination', 'Increased thirst', 'Weight loss', 'Increased appetite'],
        description: 'A metabolic disorder where the body cannot properly regulate blood sugar.',
        severity: 'severe',
        category: 'Endocrine'
      },
      {
        id: '5',
        name: 'Ear Infection',
        species: ['Dog', 'Cat'],
        symptoms: ['Head shaking', 'Scratching ears', 'Odor from ears', 'Discharge'],
        description: 'Bacterial or yeast infection in the ear canal.',
        severity: 'mild',
        category: 'Dermatological'
      },
      {
        id: '6',
        name: 'Heartworm Disease',
        species: ['Dog', 'Cat'],
        symptoms: ['Coughing', 'Fatigue', 'Weight loss', 'Difficulty breathing'],
        description: 'Serious parasitic infection transmitted by mosquitoes.',
        severity: 'severe',
        category: 'Cardiovascular'
      }
    ];
    setDiseases(mockDiseases);
    setFilteredDiseases(mockDiseases);
  }, []);

  // Get all unique symptoms for filter
  const allSymptoms = [...new Set(diseases.flatMap(disease => disease.symptoms))].sort();

  // Filter diseases
  useEffect(() => {
    let filtered = diseases;

    if (searchTerm) {
      filtered = filtered.filter(disease =>
        disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.symptoms.some(symptom => 
          symptom.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedSpecies) {
      filtered = filtered.filter(disease => disease.species.includes(selectedSpecies));
    }

    if (selectedSeverity) {
      filtered = filtered.filter(disease => disease.severity === selectedSeverity);
    }

    if (selectedSymptom) {
      filtered = filtered.filter(disease => disease.symptoms.includes(selectedSymptom));
    }

    setFilteredDiseases(filtered);
  }, [searchTerm, selectedSpecies, selectedSeverity, selectedSymptom, diseases]);

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
        return <Activity className="w-4 h-4" />;
      case 'moderate':
        return <Eye className="w-4 h-4" />;
      case 'severe':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecies('');
    setSelectedSeverity('');
    setSelectedSymptom('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pet Health Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about common pet diseases, symptoms, and treatments. Use our symptom checker 
            to find potential health issues and consult with your veterinarian.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search diseases or symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Species</option>
                <option value="Dog">Dogs</option>
                <option value="Cat">Cats</option>
              </select>

              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Severities</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>

              <select
                value={selectedSymptom}
                onChange={(e) => setSelectedSymptom(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Symptom</option>
                {allSymptoms.map((symptom) => (
                  <option key={symptom} value={symptom}>
                    {symptom}
                  </option>
                ))}
              </select>

              <button
                onClick={clearFilters}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Quick Symptom Checker */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Symptom Checker</h3>
            <p className="text-blue-800 text-sm mb-3">
              Select a symptom above to see related conditions, or search for specific symptoms in the search bar.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Coughing', 'Lethargy', 'Vomiting', 'Diarrhea', 'Loss of appetite'].map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => setSelectedSymptom(symptom)}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDiseases.length} of {diseases.length} conditions
          </p>
        </div>

        {/* Disease Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiseases.map((disease) => (
            <div
              key={disease.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{disease.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(disease.severity)}`}>
                    {getSeverityIcon(disease.severity)}
                    <span className="ml-1 capitalize">{disease.severity}</span>
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {disease.species.map((species) => (
                      <span
                        key={species}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {species}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {disease.description}
                </p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Common Symptoms:</h4>
                  <div className="flex flex-wrap gap-1">
                    {disease.symptoms.slice(0, 3).map((symptom, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                      >
                        {symptom}
                      </span>
                    ))}
                    {disease.symptoms.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{disease.symptoms.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  to={`/diseases/${disease.id}`}
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredDiseases.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Thermometer className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No conditions found
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

        {/* Emergency Notice */}
        <div className="mt-12 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Important Medical Disclaimer
              </h3>
              <p className="text-red-800 text-sm leading-relaxed">
                This information is for educational purposes only and should not replace professional veterinary advice. 
                If your pet is showing signs of illness, please consult with a qualified veterinarian immediately. 
                In case of emergency, contact your nearest emergency veterinary clinic.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}