import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true,
    maxlength: [30, 'Pet name cannot exceed 30 characters']
  },
  species: {
    type: String,
    required: [true, 'Species is required'],
    enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Guinea Pig', 'Other']
  },
  breed: {
    type: String,
    required: [true, 'Breed is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age cannot be negative'],
    max: [30, 'Age seems unrealistic']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female']
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
    enum: ['Small', 'Medium', 'Large', 'Extra Large']
  },
  weight: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  personality: [{
    type: String,
    trim: true
  }],
  images: [{
    url: { type: String, required: true },
    publicId: String,
    isPrimary: { type: Boolean, default: false }
  }],
  adoptionFee: {
    type: Number,
    required: [true, 'Adoption fee is required'],
    min: [0, 'Adoption fee cannot be negative']
  },
  location: {
    shelter: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  healthInfo: {
    vaccinated: { type: Boolean, default: false },
    spayedNeutered: { type: Boolean, default: false },
    microchipped: { type: Boolean, default: false },
    houseTrained: { type: Boolean, default: false },
    medicalHistory: [String],
    specialNeeds: String
  },
  adoptionRequirements: [String],
  status: {
    type: String,
    enum: ['available', 'pending', 'adopted', 'unavailable'],
    default: 'available'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  inquiries: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'responded', 'closed'], default: 'pending' }
  }],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better search performance
petSchema.index({ species: 1, status: 1 });
petSchema.index({ breed: 1 });
petSchema.index({ age: 1 });
petSchema.index({ size: 1 });
petSchema.index({ 'location.city': 1, 'location.state': 1 });
petSchema.index({ featured: -1, createdAt: -1 });

// Virtual for primary image
petSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0] ? this.images[0].url : '');
});

// Method to increment views
petSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

export default mongoose.model('Pet', petSchema);