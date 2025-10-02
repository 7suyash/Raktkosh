const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  role: {
    type: String,
    enum: ['donor', 'bloodbank', 'hospital', 'admin'],
    default: 'donor'
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null],
    default: null
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  healthInfo: {
    weight: Number, // in kg
    height: Number, // in cm
    lastDonationDate: Date,
    isSmoker: { type: Boolean, default: false },
    hasChronicDisease: { type: Boolean, default: false },
    medications: [String],
    allergies: [String]
  },
  donorStatus: {
    isEligible: { type: Boolean, default: true },
    lastScreeningDate: Date,
    totalDonations: { type: Number, default: 0 },
    lastDonationDate: Date,
    nextEligibleDate: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if donor is eligible to donate
userSchema.methods.isEligibleToDonate = function() {
  if (!this.donorStatus.isEligible) return false;
  if (this.healthInfo.weight < 45) return false;
  
  const today = new Date();
  const age = today.getFullYear() - this.dateOfBirth.getFullYear();
  if (age < 18 || age > 65) return false;
  
  if (this.donorStatus.nextEligibleDate && today < this.donorStatus.nextEligibleDate) {
    return false;
  }
  
  return true;
};

// Calculate next eligible donation date
userSchema.methods.calculateNextDonationDate = function() {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 90); // 3 months gap
  return nextDate;
};

// Public profile (exclude sensitive data)
userSchema.methods.toPublicJSON = function() {
  const userObject = this.toObject();
  
  delete userObject.password;
  delete userObject.verificationToken;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpire;
  
  return userObject;
};

module.exports = mongoose.model('User', userSchema);