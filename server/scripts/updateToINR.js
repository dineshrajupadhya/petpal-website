import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pet from '../models/Pet.js';
import Product from '../models/Product.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://Dinesh_Upadhya:PetPal123@cluster0.aig8rax.mongodb.net/petpal?retryWrites=true&w=majority';

const updateToINR = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to DB');

  // Update pet adoption fees and locations
  const pets = await Pet.find({});
  const petUpdates = [
    { name: 'Buddy', adoptionFee: 5000, location: { shelter: 'Happy Tails Animal Shelter', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001' } },
    { name: 'Luna', adoptionFee: 3000, location: { shelter: 'Feline Friends Rescue', city: 'Bangalore', state: 'Karnataka', zipCode: '560001' } },
    { name: 'Charlie', adoptionFee: 4000, location: { shelter: 'Second Chance Animal Rescue', city: 'Delhi', state: 'Delhi', zipCode: '110001' } },
  ];

  for (const update of petUpdates) {
    await Pet.updateOne({ name: update.name }, { $set: update });
    console.log(`Updated pet: ${update.name}`);
  }

  // Update product prices
  const prodUpdates = [
    { name: 'Premium Dog Food - Chicken & Rice', price: 2499, originalPrice: 3299 },
    { name: 'Interactive Cat Toy - Feather Wand', price: 699, originalPrice: null },
    { name: 'Comfortable Pet Bed - Large', price: 3999, originalPrice: null },
  ];

  for (const update of prodUpdates) {
    const set = { price: update.price };
    if (update.originalPrice) set.originalPrice = update.originalPrice;
    await Product.updateOne({ name: update.name }, { $set: set });
    console.log(`Updated product: ${update.name}`);
  }

  console.log('Done!');
  await mongoose.disconnect();
};

updateToINR().catch(console.error);
