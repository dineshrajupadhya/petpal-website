import mongoose from 'mongoose';

const diseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Disease name is required'],
    trim: true,
    unique: true
  },
  species: [{
    type: String,
    required: true,
    enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Guinea Pig', 'All']
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Respiratory', 'Digestive', 'Skin', 'Cardiovascular', 'Neurological', 'Musculoskeletal', 'Endocrine', 'Infectious', 'Parasitic', 'Genetic', 'Behavioral', 'Other']
  },
  severity: {
    type: String,
    required: [true, 'Severity is required'],
    enum: ['mild', 'moderate', 'severe', 'critical']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  symptoms: [{
    name: { type: String, required: true },
    description: String,
    severity: { type: String, enum: ['mild', 'moderate', 'severe'] }
  }],
  causes: [{
    type: String,
    required: true
  }],
  transmission: [{
    type: String
  }],
  diagnosis: [{
    method: String,
    description: String
  }],
  treatment: {
    immediate: [String],
    medication: [{
      name: String,
      dosage: String,
      duration: String,
      notes: String
    }],
    procedures: [String],
    homecare: [String]
  },
  prevention: [{
    type: String,
    required: true
  }],
  prognosis: {
    type: String,
    required: true
  },
  whenToSeeVet: [{
    type: String,
    required: true
  }],
  relatedDiseases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disease'
  }],
  images: [{
    url: String,
    caption: String,
    type: { type: String, enum: ['symptom', 'treatment', 'prevention'] }
  }],
  references: [{
    title: String,
    url: String,
    author: String,
    publishedDate: Date
  }],
  lastReviewed: {
    type: Date,
    default: Date.now
  },
  reviewedBy: {
    name: String,
    credentials: String
  },
  tags: [String],
  isPublished: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for search and filtering
diseaseSchema.index({ species: 1, category: 1 });
diseaseSchema.index({ severity: 1 });
diseaseSchema.index({ 'symptoms.name': 1 });
diseaseSchema.index({ tags: 1 });

// Method to increment views
diseaseSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

export default mongoose.model('Disease', diseaseSchema);