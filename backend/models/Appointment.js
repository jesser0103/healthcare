const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
  
  // Appointment Details
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  
  // Type and Status
  appointmentType: {
    type: String,
    enum: ['Consultation', 'Follow-up', 'Emergency', 'Routine Checkup', 'Surgery'],
    default: 'Consultation'
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'],
    default: 'Scheduled'
  },
  
  // Additional Information
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required']
  },
  notes: String,
  
  // Cancellation
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['Patient', 'Doctor', 'System']
  },
  cancelledAt: Date
}, {
  timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ patient: 1, appointmentDate: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
