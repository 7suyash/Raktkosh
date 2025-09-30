// models/Donor.js - Donor Model
const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  allergies: [{
    type: String,
    trim: true
  }],
  medications: [{
    type: String,
    trim: true
  }],
  diseases: [{
    type: String,
    trim: true
  }],
  surgeries: [{
    type: String,
    date: Date
  }]
});

const donationHistorySchema = new mongoose.Schema({
  donationDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  bloodBankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodBank'
  },
  unitsdonated: {
    type: Number,
    default: 1
  },
  notes: String
}, {
  timestamps: true
});

const donorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: [true, 'Blood group is required']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(value) {
        const age = Math.floor((Date.now() - value.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        return age >= 18 && age <= 65;
      },
      message: 'Donor must be between 18 and 65 years old'
    }
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [45, 'Weight must be at least 45 kg for donation eligibility']
  },
  height: {
    type: Number, // in cm
    min: [150, 'Height must be at least 150 cm']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required']
  },
  lastDonation: {
    type: Date,
    default: null
  },
  medicalHistory: {
    type: medicalHistorySchema,
    default: {}
  },
  donationHistory: [donationHistorySchema],
  availableForDonation: {
    type: Boolean,
    default: true
  },
  donationCount: {
    type: Number,
    default: 0
  },
  eligibilityStatus: {
    type: String,
    enum: ['eligible', 'not_eligible', 'temporary_defer'],
    default: 'eligible'
  },
  eligibilityReason: String,
  preferredDonationTime: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'any']
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  // Verification documents
  documents: {
    identityProof: String, // URL to uploaded document
    addressProof: String,
    medicalCertificate: String
  },
  // Preferences
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    push: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Calculate age
donorSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
});

// Calculate days since last donation
donorSchema.virtual('daysSinceLastDonation').get(function() {
  if (!this.lastDonation) return null;
  return Math.floor((Date.now() - this.lastDonation.getTime()) / (24 * 60 * 60 * 1000));
});

// Check if eligible to donate (minimum 56 days gap)
donorSchema.virtual('canDonate').get(function() {
  if (!this.lastDonation) return this.eligibilityStatus === 'eligible';
  const daysSince = this.daysSinceLastDonation;
  return daysSince >= 56 && this.eligibilityStatus === 'eligible' && this.availableForDonation;
});

// Instance method to update donation history
donorSchema.methods.addDonation = function(donationDetails) {
  this.donationHistory.push(donationDetails);
  this.lastDonation = donationDetails.donationDate;
  this.donationCount += 1;
  return this.save();
};

// Instance method to check medical eligibility
donorSchema.methods.checkMedicalEligibility = function() {
  const { medicalHistory } = this;
  const disqualifyingConditions = [
    'HIV', 'AIDS', 'Hepatitis B', 'Hepatitis C', 'Malaria', 
    'Heart Disease', 'Cancer', 'Diabetes (Insulin dependent)'
  ];
  
  const hasDiqualifyingCondition = medicalHistory.diseases.some(disease =>
    disqualifyingConditions.some(condition => 
      disease.toLowerCase().includes(condition.toLowerCase())
    )
  );
  
  if (hasDiqualifyingCondition) {
    this.eligibilityStatus = 'not_eligible';
    this.eligibilityReason = 'Medical condition disqualifies donation';
  }
  
  return !hasDiqualifyingCondition;
};

// Static method to find eligible donors by blood group
donorSchema.statics.findEligibleByBloodGroup = function(bloodGroup, location, radius = 10000) {
  return this.find({
    bloodGroup: bloodGroup,
    eligibilityStatus: 'eligible',
    availableForDonation: true
  }).populate({
    path: 'userId',
    match: {
      'address.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: location
          },
          $maxDistance: radius
        }
      },
      isActive: true
    }
  });
};

// Static method to get blood group compatibility
donorSchema.statics.getCompatibleDonors = function(requiredBloodGroup) {
  const compatibility = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal recipient
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-'] // Universal donor
  };
  
  return compatibility[requiredBloodGroup] || [];
};

module.exports = mongoose.model('Donor', donorSchema);