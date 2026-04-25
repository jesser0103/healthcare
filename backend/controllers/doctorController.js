const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single doctor
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create doctor
exports.createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      data: doctor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create doctor',
      error: error.message
    });
  }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Doctor updated successfully',
      data: doctor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update doctor',
      error: error.message
    });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get doctor's appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { date, status } = req.query;
    
    let query = { doctor: req.params.id };
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      query.appointmentDate = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }
    
    if (status) {
      query.status = status;
    }
    
    const appointments = await Appointment.find(query)
      .populate('patient', 'firstName lastName email phone')
      .sort({ appointmentDate: 1, startTime: 1 });
    
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

// Get doctors by specialization
exports.getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;
    
    const doctors = await Doctor.find({ 
      specialization: specialization,
      status: 'Active'
    });
    
    res.json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
