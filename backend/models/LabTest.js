const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema({
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
  testNumber: {
    type: String,
    unique: true,
    required: true
  },
  testName: {
    type: String,
    required: true
  },
  testType: {
    type: String,
    enum: ['Blood Test', 'Urine Test', 'X-Ray', 'MRI', 'CT Scan', 'Ultrasound', 'ECG', 'Other'],
    required: true
  },
  orderedDate: {
    type: Date,
    default: Date.now
  },
  scheduledDate: Date,
  completedDate: Date,
  status: {
    type: String,
    enum: ['Ordered', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Ordered'
  },
  priority: {
    type: String,
    enum: ['Routine', 'Urgent', 'Emergency'],
    default: 'Routine'
  },
  instructions: String,
  results: [{
    parameter: String,
    value: String,
    unit: String,
    referenceRange: String,
    status: {
      type: String,
      enum: ['Normal', 'Abnormal', 'Critical']
    }
  }],
  overallResult: String,
  doctorNotes: String,
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  cost: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

labTestSchema.pre('validate', function(next) {
  if (!this.testNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.testNumber = `LAB${year}${month}${random}`;
  }
  next();
});

module.exports = mongoose.model('LabTest', labTestSchema);
