const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  
  // Professional Information
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: [
      'General Practice',
      'Cardiology',
      'Dermatology',
      'Pediatrics',
      'Orthopedics',
      'Neurology',
      'Psychiatry',
      'Oncology',
      'Radiology',
      'Surgery',
      'Other'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true
  },
  yearsOfExperience: {
    type: Number,
    min: 0
  },
  qualifications: [String],
  
  // Work Schedule
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String
  }],
  consultationFee: {
    type: Number,
    min: 0
  },
  
  // System Fields
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Retired'],
    default: 'Active'
  },
  joinedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for full name
doctorSchema.virtual('fullName').get(function() {
  return `Dr. ${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
doctorSchema.set('toJSON', { virtuals: true });
doctorSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Doctor', doctorSchema);
