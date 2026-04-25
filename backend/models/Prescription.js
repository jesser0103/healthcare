const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  medicalRecord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord'
  },
  prescriptionNumber: {
    type: String,
    unique: true,
    required: true
  },
  prescriptionDate: {
    type: Date,
    default: Date.now
  },
  medications: [{
    name: {
      type: String,
      required: true
    },
    genericName: String,
    dosage: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    quantity: Number,
    instructions: String,
    refillsAllowed: {
      type: Number,
      default: 0
    }
  }],
  diagnosis: String,
  notes: String,
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled', 'Expired'],
    default: 'Active'
  },
  validUntil: Date,
  digitalSignature: String,
  signedAt: Date
}, {
  timestamps: true
});

prescriptionSchema.pre('save', async function(next) {
  if (!this.prescriptionNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.prescriptionNumber = `RX${year}${month}${random}`;
  }
  next();
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
