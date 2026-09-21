import mongoose from 'mongoose';

const adoptionApplicationSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    occupation: String
  },
  housing: {
    type: { type: String, enum: ['house', 'apartment', 'condo', 'farm', 'other'], required: true },
    ownership: { type: String, enum: ['own', 'rent', 'living with family'], required: true },
    hasYard: { type: Boolean, default: false },
    landlordAllowsPets: { type: Boolean, default: true }
  },
  experience: {
    hasPets: { type: Boolean, default: false },
    currentPets: String,
    previousPets: String,
    vetName: String,
    vetPhone: String
  },
  lifestyle: {
    hoursAwayFromHome: { type: String, required: true },
    exerciseRoutine: String,
    travelFrequency: String,
    someoneHomeOften: { type: Boolean, default: true }
  },
  references: {
    personalReference: { name: String, phone: String, relationship: String },
    veterinaryReference: { name: String, phone: String }
  },
  agreement: {
    homeVisit: { type: Boolean, default: true },
    followUp: { type: Boolean, default: true },
    returnPolicy: { type: Boolean, default: true }
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  adminNotes: String,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date
}, {
  timestamps: true
});

adoptionApplicationSchema.index({ petId: 1, userId: 1 });
adoptionApplicationSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('AdoptionApplication', adoptionApplicationSchema);
