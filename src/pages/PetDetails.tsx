import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Calendar, Users, CheckCircle, Phone, Mail } from 'lucide-react';

export default function PetDetails() {
  const { id } = useParams();

  // Mock data - in a real app, this would be fetched based on the ID
  const pet = {
    id: '1',
    name: 'Buddy',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'Male',
    size: 'Large',
    weight: '65 lbs',
    color: 'Golden',
    description: 'Buddy is a friendly and energetic Golden Retriever who loves to play fetch and go on long walks. He\'s great with kids and other pets, making him the perfect addition to any family. Buddy has been with us for 2 months and is looking for his forever home.',
    personality: ['Friendly', 'Energetic', 'Loyal', 'Playful', 'Good with kids'],
    images: [
      'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    adoptionFee: 250,
    vaccinated: true,
    spayedNeutered: true,
    microchipped: true,
    houseTrained: true,
    location: 'New York, NY',
    shelter: 'Happy Tails Animal Shelter',
    shelterContact: {
      phone: '(555) 123-4567',
      email: 'adopt@happytails.org'
    },
    medicalHistory: [
      'Fully vaccinated (DHPP, Rabies)',
      'Heartworm negative',
      'Flea and tick prevention up to date',
      'Health certificate available'
    ],
    requirements: [
      'Fenced yard preferred',
      'Active family or individual',
      'Experience with large dogs helpful',
      'No apartment living'
    ]
  };

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/adoption"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Adoption
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={pet.images[currentImageIndex]}
                alt={pet.name}
                className="w-full h-96 object-cover rounded-xl"
              />
              <button className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <div className="flex space-x-4">
              {pet.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-1 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${pet.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Pet Info */}
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl font-bold text-gray-900">{pet.name}</h1>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">${pet.adoptionFee}</div>
                  <div className="text-sm text-gray-500">Adoption Fee</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {pet.personality.map((trait, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {trait}
                  </span>
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed">{pet.description}</p>
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Breed</div>
                  <div className="font-medium">{pet.breed}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Age</div>
                  <div className="font-medium">{pet.age} years old</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Gender</div>
                  <div className="font-medium">{pet.gender}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Size</div>
                  <div className="font-medium">{pet.size}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Weight</div>
                  <div className="font-medium">{pet.weight}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Color</div>
                  <div className="font-medium">{pet.color}</div>
                </div>
              </div>
            </div>

            {/* Health Status */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Health Status</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Vaccinated</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Spayed/Neutered</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Microchipped</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">House Trained</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                  {pet.location}
                </div>
                <div className="text-gray-600">{pet.shelter}</div>
              </div>
            </div>

            {/* Contact & Adopt */}
            <div className="space-y-4">
              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg">
                Start Adoption Process
              </button>
              
              <div className="flex space-x-4">
                <a
                  href={`tel:${pet.shelterContact.phone}`}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call</span>
                </a>
                <a
                  href={`mailto:${pet.shelterContact.email}`}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Medical History */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Medical History</h3>
            <ul className="space-y-2">
              {pet.medicalHistory.map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Adoption Requirements */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Adoption Requirements</h3>
            <ul className="space-y-2">
              {pet.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}