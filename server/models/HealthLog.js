import mongoose from 'mongoose';

const healthLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['diet', 'fitness', 'sleep', 'mood'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
});

healthLogSchema.index({ userId: 1, type: 1, date: -1 });

export default mongoose.model('HealthLog', healthLogSchema);
