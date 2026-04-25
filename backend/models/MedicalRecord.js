const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient is required']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor is required']
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  
  // Visit Information
  visitDate: {
    type: Date,
    required: [true, 'Visit date is required'],
    default: Date.now
  },
  visitType: {
    type: String,
    enum: ['Consultation', 'Follow-up', 'Emergency', 'Routine Checkup'],
    default: 'Consultation'
  },
  
  // Medical Details
  chiefComplaint: {
    type: String,
    required: [true, 'Chief complaint is required']
  },
  symptoms: [String],
  
  // Vital Signs
  vitalSigns: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number,
    respiratoryRate: Number,
    oxygenSaturation: Number
  },
  
  // Diagnosis and Treatment
  diagnosis: {
    type: String,
    required: [true, 'Diagnosis is required']
  },
  diagnosisCodes: [String],
  
  treatmentPlan: String,
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  
  // Additional Information
  labTestsOrdered: [String],
  referrals: [String],
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  
  // Doctor's Notes
  doctorNotes: String,
  
  // Attachments
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
medicalRecordSchema.index({ patient: 1, visitDate: -1 });
medicalRecordSchema.index({ doctor: 1, visitDate: -1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
