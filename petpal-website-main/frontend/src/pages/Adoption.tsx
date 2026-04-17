import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Heart, MapPin, Calendar, Users } from 'lucide-react';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  description: string;
  image: string;
  adoptionFee: number;
  vaccinated: boolean;
  location: string;
}

export default function Adoption() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    species: '',
    size: '',
    age: '',
    gender: ''
  });

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockPets: Pet[] = [
      {
        id: '1',
        name: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: 3,
        gender: 'Male',
        size: 'Large',
        description: 'Friendly and energetic dog, great with kids and other pets.',
        image: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400',
        adoptionFee: 250,
        vaccinated: true,
        location: 'New York, NY'
      },
      {
        id: '2',
        name: 'Luna',
        species: 'Cat',
        breed: 'Persian',
        age: 2,
        gender: 'Female',
        size: 'Medium',
        description: 'Calm and affectionate cat, loves to cuddle and play with toys.',
        image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400',
        adoptionFee: 150,
        vaccinated: true,
        location: 'Los Angeles, CA'
      },
      {
        id: '3',
        name: 'Charlie',
        species: 'Dog',
        breed: 'Labrador Mix',
        age: 1,
        gender: 'Male',
        size: 'Medium',
        description: 'Young and playful puppy, needs an active family.',
        image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
        adoptionFee: 200,
        vaccinated: true,
        location: 'Chicago, IL'
      },
      {
        id: '4',
        name: 'Whiskers',
        species: 'Cat',
        breed: 'Maine Coon',
        age: 4,
        gender: 'Male',
        size: 'Large',
        description: 'Gentle giant, very calm and good with children.',
        image: 'https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&w=400',
        adoptionFee: 180,
        vaccinated: true,
        location: 'Houston, TX'
      },
      {
        id: '5',
        name: 'Bella',
        species: 'Dog',
        breed: 'Beagle',
        age: 5,
        gender: 'Female',
        size: 'Small',
        description: 'Sweet and loyal companion, great for apartments.',
        image: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400',
        adoptionFee: 175,
        vaccinated: true,
        location: 'Miami, FL'
      },
      {
        id: '6',
        name: 'Oliver',
        species: 'Cat',
        breed: 'British Shorthair',
        age: 3,
        gender: 'Male',
        size: 'Medium',
        description: 'Independent but loving, perfect for busy professionals.',
        image: 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=400',
        adoptionFee: 160,
        vaccinated: true,
        location: 'Seattle, WA'
      }
    ];
    setPets(mockPets);
    setFilteredPets(mockPets);
  }, []);

  // Filter pets based on search and filters
  useEffect(() => {
    let filtered = pets;

    if (searchTerm) {
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.species.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.species) {
      filtered = filtered.filter(pet => pet.species === filters.species);
    }

    if (filters.size) {
      filtered = filtered.filter(pet => pet.size === filters.size);
    }

    if (filters.gender) {
      filtered = filtered.filter(pet => pet.gender === filters.gender);
    }

    if (filters.age) {
      if (filters.age === 'young') {
        filtered = filtered.filter(pet => pet.age <= 2);
      } else if (filters.age === 'adult') {
        filtered = filtered.filter(pet => pet.age > 2 && pet.age <= 6);
      } else if (filters.age === 'senior') {
        filtered = filtered.filter(pet => pet.age > 6);
      }
    }

    setFilteredPets(filtered);
  }, [searchTerm, filters, pets]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      species: '',
      size: '',
      age: '',
      gender: ''
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Companion
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our available pets and find your new best friend. All pets are vaccinated, 
            health-checked, and ready for their forever homes.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, breed, or species..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filters.species}
                onChange={(e) => handleFilterChange('species', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Species</option>
                <option value="Dog">Dogs</option>
                <option value="Cat">Cats</option>
              </select>

              <select
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Sizes</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>

              <select
                value={filters.age}
                onChange={(e) => handleFilterChange('age', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Ages</option>
                <option value="young">Young (0-2 years)</option>
                <option value="adult">Adult (3-6 years)</option>
                <option value="senior">Senior (7+ years)</option>
              </select>

              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <button
                onClick={clearFilters}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPets.length} of {pets.length} pets
          </p>
        </div>

        {/* Pet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                {pet.vaccinated && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Vaccinated
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
                  <span className="text-lg font-semibold text-blue-600">
                    ${pet.adoptionFee}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{pet.breed}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {pet.age} {pet.age === 1 ? 'year' : 'years'} old
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {pet.gender} • {pet.size}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {pet.location}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {pet.description}
                </p>

                <Link
                  to={`/adoption/${pet.id}`}
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredPets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Heart className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No pets found
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
      </div>
    </div>
  );
}