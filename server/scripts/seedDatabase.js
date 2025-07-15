import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Pet from '../models/Pet.js';
import Product from '../models/Product.js';
import Disease from '../models/Disease.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/petpal');
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    await User.deleteMany({});
    
    const users = [
      {
        name: 'Admin User',
        email: 'admin@petpal.com',
        password: 'admin123',
        isAdmin: true,
        phone: '(555) 123-4567',
        address: {
          street: '123 Admin Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        }
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '(555) 234-5678',
        address: {
          street: '456 User Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210'
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        phone: '(555) 345-6789',
        address: {
          street: '789 Customer Lane',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601'
        }
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

const seedPets = async (users) => {
  try {
    await Pet.deleteMany({});
    
    const adminUser = users.find(user => user.isAdmin);
    
    const pets = [
      {
        name: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: 3,
        gender: 'Male',
        size: 'Large',
        weight: '65 lbs',
        color: 'Golden',
        description: 'Buddy is a friendly and energetic Golden Retriever who loves to play fetch and go on long walks. He\'s great with kids and other pets.',
        personality: ['Friendly', 'Energetic', 'Loyal', 'Playful', 'Good with kids'],
        images: [{
          url: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPrimary: true
        }],
        adoptionFee: 250,
        location: {
          shelter: 'Happy Tails Animal Shelter',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        healthInfo: {
          vaccinated: true,
          spayedNeutered: true,
          microchipped: true,
          houseTrained: true,
          medicalHistory: ['Fully vaccinated', 'Heartworm negative']
        },
        adoptionRequirements: ['Fenced yard preferred', 'Active family'],
        addedBy: adminUser._id
      },
      {
        name: 'Luna',
        species: 'Cat',
        breed: 'Persian',
        age: 2,
        gender: 'Female',
        size: 'Medium',
        weight: '8 lbs',
        color: 'White',
        description: 'Luna is a calm and affectionate Persian cat who loves to cuddle and play with toys.',
        personality: ['Calm', 'Affectionate', 'Gentle', 'Indoor cat'],
        images: [{
          url: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPrimary: true
        }],
        adoptionFee: 150,
        location: {
          shelter: 'Feline Friends Rescue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210'
        },
        healthInfo: {
          vaccinated: true,
          spayedNeutered: true,
          microchipped: true,
          houseTrained: true,
          medicalHistory: ['Fully vaccinated', 'Spayed']
        },
        adoptionRequirements: ['Indoor only', 'Quiet home preferred'],
        addedBy: adminUser._id
      },
      {
        name: 'Charlie',
        species: 'Dog',
        breed: 'Labrador Mix',
        age: 1,
        gender: 'Male',
        size: 'Medium',
        weight: '45 lbs',
        color: 'Black',
        description: 'Charlie is a young and playful Labrador mix who needs an active family.',
        personality: ['Playful', 'Energetic', 'Young', 'Trainable'],
        images: [{
          url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPrimary: true
        }],
        adoptionFee: 200,
        location: {
          shelter: 'Second Chance Animal Rescue',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601'
        },
        healthInfo: {
          vaccinated: true,
          spayedNeutered: true,
          microchipped: true,
          houseTrained: false,
          medicalHistory: ['Vaccinated', 'Neutered']
        },
        adoptionRequirements: ['Active family', 'Training commitment'],
        addedBy: adminUser._id
      }
    ];

    const createdPets = await Pet.insertMany(pets);
    console.log(`✅ Created ${createdPets.length} pets`);
    return createdPets;
  } catch (error) {
    console.error('Error seeding pets:', error);
  }
};

const seedProducts = async (users) => {
  try {
    await Product.deleteMany({});
    
    const adminUser = users.find(user => user.isAdmin);
    
    const products = [
      {
        name: 'Premium Dog Food - Chicken & Rice',
        description: 'High-quality dry dog food made with real chicken as the first ingredient.',
        category: 'Food',
        brand: 'PetNutrition',
        price: 49.99,
        originalPrice: 59.99,
        images: [{
          url: 'https://images.pexels.com/photos/4498135/pexels-photo-4498135.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPrimary: true
        }],
        specifications: {
          weight: '30 lbs',
          species: ['Dog'],
          ageGroup: 'Adult'
        },
        features: ['Real chicken first ingredient', 'No artificial preservatives', 'Complete nutrition'],
        inventory: {
          stock: 50,
          sku: 'DOG-FOOD-001'
        },
        rating: {
          average: 4.8,
          count: 1247
        },
        addedBy: adminUser._id
      },
      {
        name: 'Interactive Cat Toy - Feather Wand',
        description: 'Engaging feather wand toy to keep your cat active and entertained.',
        category: 'Toys',
        brand: 'PlayTime',
        price: 15.99,
        images: [{
          url: 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPrimary: true
        }],
        specifications: {
          species: ['Cat'],
          material: 'Feathers, Wood'
        },
        features: ['Interactive play', 'Exercise promotion', 'Mental stimulation'],
        inventory: {
          stock: 100,
          sku: 'CAT-TOY-001'
        },
        rating: {
          average: 4.6,
          count: 892
        },
        addedBy: adminUser._id
      },
      {
        name: 'Comfortable Pet Bed - Large',
        description: 'Orthopedic pet bed with memory foam for maximum comfort.',
        category: 'Beds',
        brand: 'ComfortPet',
        price: 79.99,
        images: [{
          url: 'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=800',
          isPrimary: true
        }],
        specifications: {
          size: ['Large'],
          material: 'Memory foam, Washable cover',
          species: ['Dog', 'Cat']
        },
        features: ['Orthopedic support', 'Washable cover', 'Non-slip bottom'],
        inventory: {
          stock: 25,
          sku: 'PET-BED-001'
        },
        rating: {
          average: 4.9,
          count: 2156
        },
        addedBy: adminUser._id
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);
    return createdProducts;
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

const seedDiseases = async () => {
  try {
    await Disease.deleteMany({});
    
    const diseases = [
      {
        name: 'Kennel Cough',
        species: ['Dog'],
        category: 'Respiratory',
        severity: 'mild',
        description: 'Kennel cough is a highly contagious respiratory infection that affects dogs.',
        symptoms: [
          { name: 'Persistent dry cough', severity: 'moderate' },
          { name: 'Gagging', severity: 'mild' },
          { name: 'Retching', severity: 'mild' },
          { name: 'Nasal discharge', severity: 'mild' }
        ],
        causes: [
          'Bordetella bronchiseptica bacteria',
          'Canine parainfluenza virus',
          'Canine adenovirus'
        ],
        transmission: [
          'Airborne droplets from coughing',
          'Direct contact with infected dogs',
          'Contaminated surfaces'
        ],
        diagnosis: [
          { method: 'Physical examination', description: 'Veterinary assessment of symptoms' },
          { method: 'Medical history review', description: 'Recent exposure to other dogs' }
        ],
        treatment: {
          immediate: ['Rest and isolation', 'Cough suppressants'],
          medication: [
            { name: 'Dextromethorphan', dosage: 'As prescribed', duration: '7-10 days' }
          ],
          homecare: ['Humidifier use', 'Limit exercise']
        },
        prevention: [
          'Vaccination (Bordetella vaccine)',
          'Avoid crowded dog areas during outbreaks',
          'Maintain good hygiene'
        ],
        prognosis: 'Most dogs recover completely within 1-3 weeks with proper care',
        whenToSeeVet: [
          'Persistent cough lasting more than a week',
          'Difficulty breathing',
          'Loss of appetite for more than 24 hours'
        ]
      },
      {
        name: 'Feline Upper Respiratory Infection',
        species: ['Cat'],
        category: 'Respiratory',
        severity: 'moderate',
        description: 'Common viral or bacterial infection affecting cats\' upper respiratory system.',
        symptoms: [
          { name: 'Sneezing', severity: 'mild' },
          { name: 'Runny nose', severity: 'mild' },
          { name: 'Eye discharge', severity: 'moderate' },
          { name: 'Lethargy', severity: 'moderate' }
        ],
        causes: [
          'Feline herpesvirus',
          'Feline calicivirus',
          'Bacterial infections'
        ],
        transmission: [
          'Direct contact with infected cats',
          'Airborne droplets',
          'Contaminated objects'
        ],
        treatment: {
          immediate: ['Supportive care', 'Keep nasal passages clear'],
          medication: [
            { name: 'Antibiotics', dosage: 'As prescribed', duration: '7-14 days' }
          ],
          homecare: ['Humidifier', 'Encourage eating and drinking']
        },
        prevention: [
          'Vaccination',
          'Avoid contact with sick cats',
          'Good hygiene practices'
        ],
        prognosis: 'Most cats recover within 7-21 days with proper treatment',
        whenToSeeVet: [
          'Not eating for more than 24 hours',
          'Difficulty breathing',
          'Severe eye discharge'
        ]
      }
    ];

    const createdDiseases = await Disease.insertMany(diseases);
    console.log(`✅ Created ${createdDiseases.length} diseases`);
    return createdDiseases;
  } catch (error) {
    console.error('Error seeding diseases:', error);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    const users = await seedUsers();
    await seedPets(users);
    await seedProducts(users);
    await seedDiseases();
    
    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();