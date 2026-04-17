import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  messages: [{
    sender: {
      type: String,
      enum: ['user', 'bot', 'admin'],
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      botConfidence: Number,
      intent: String,
      entities: [String],
      adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  }],
  status: {
    type: String,
    enum: ['active', 'resolved', 'escalated', 'closed'],
    default: 'active'
  },
  category: {
    type: String,
    enum: ['adoption', 'health', 'products', 'orders', 'general', 'complaint'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [String],
  rating: {
    score: { type: Number, min: 1, max: 5 },
    feedback: String,
    ratedAt: Date
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update last activity on message add
chatSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.lastActivity = new Date();
  }
  next();
});

// Indexes
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ sessionId: 1 });
chatSchema.index({ status: 1, priority: -1 });
chatSchema.index({ assignedTo: 1 });
chatSchema.index({ lastActivity: -1 });

export default mongoose.model('Chat', chatSchema);