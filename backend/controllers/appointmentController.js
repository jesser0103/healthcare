const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const query = {};

    if (req.query.patient) {
      query.patient = req.query.patient;
    }

    if (req.query.doctor) {
      query.doctor = req.query.doctor;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName specialization')
      .sort({ appointmentDate: -1 });
    
    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single appointment
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('doctor');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create appointment
exports.createAppointment = async (req, res) => {
  try {
    const { patient, doctor, appointmentDate, startTime, endTime } = req.body;

    const apptDate = new Date(appointmentDate);
    if (Number.isNaN(apptDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointmentDate'
      });
    }

    const startOfDay = new Date(apptDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(apptDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Check if patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    // Check if doctor exists
    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      doctor: doctor,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['Cancelled', 'Completed'] },
      $or: [
        { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
        { startTime: { $lt: endTime }, endTime: { $gte: endTime } }
      ]
    });
    
    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not available at this time'
      });
    }
    
    const appointment = await Appointment.create(req.body);
    
    await appointment.populate('patient', 'firstName lastName email phone');
    await appointment.populate('doctor', 'firstName lastName specialization');
    
    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message
    });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('patient', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName specialization');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update appointment',
      error: error.message
    });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { cancellationReason, cancelledBy } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Cancelled',
        cancellationReason: cancellationReason,
        cancelledBy: cancelledBy,
        cancelledAt: Date.now()
      },
      { new: true }
    )
      .populate('patient', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName specialization');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message
    });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get upcoming appointments
exports.getUpcomingAppointments = async (req, res) => {
  try {
    const now = new Date();

    const query = {
      appointmentDate: { $gte: now },
      status: { $in: ['Scheduled', 'Confirmed'] }
    };

    if (req.query.patient) {
      query.patient = req.query.patient;
    }

    if (req.query.doctor) {
      query.doctor = req.query.doctor;
    }
    
    const appointments = await Appointment.find(query)
      .populate('patient', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName specialization')
      .sort({ appointmentDate: 1, startTime: 1 })
      .limit(20);
    
    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
