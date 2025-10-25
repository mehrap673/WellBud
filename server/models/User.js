import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password required only if not Google OAuth
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  googleId: {
    type: String,
    sparse: true,
    index: true
  },
  avatar: {
    type: String,
    default: null
  },
  
  // Profile Information
  age: {
    type: Number,
    min: [1, 'Age must be at least 1'],
    max: [120, 'Age must be less than 120'],
    default: null
  },
  weight: {
    type: Number,
    min: [1, 'Weight must be at least 1 kg'],
    max: [300, 'Weight must be less than 300 kg'],
    default: null
  },
  height: {
    type: Number,
    min: [1, 'Height must be at least 1 cm'],
    max: [300, 'Height must be less than 300 cm'],
    default: null
  },
  goal: {
    type: String,
    enum: ['weight-loss', 'muscle-gain', 'maintenance', 'general-health', ''],
    default: ''
  },
  
  // Settings
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  },
  preferences: {
    dailyCalorieGoal: { 
      type: Number, 
      default: 2000,
      min: [500, 'Calorie goal must be at least 500'],
      max: [10000, 'Calorie goal must be less than 10000']
    },
    dailyStepsGoal: { 
      type: Number, 
      default: 10000,
      min: [1000, 'Steps goal must be at least 1000'],
      max: [100000, 'Steps goal must be less than 100000']
    },
    dailySleepGoal: { 
      type: Number, 
      default: 8,
      min: [1, 'Sleep goal must be at least 1 hour'],
      max: [24, 'Sleep goal must be less than 24 hours']
    }
  }
}, {
  timestamps: true
});

// Hash password before saving (only if password is modified and exists)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    return false; // Google OAuth user, no password
  }
  
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without password)
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    age: this.age,
    weight: this.weight,
    height: this.height,
    goal: this.goal,
    theme: this.theme,
    preferences: this.preferences,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Virtual for BMI calculation
userSchema.virtual('bmi').get(function() {
  if (!this.weight || !this.height) return null;
  const heightInMeters = this.height / 100;
  return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
});

// Ensure virtuals are included when converting to JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Add indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ createdAt: -1 });

export default mongoose.model('User', userSchema);
