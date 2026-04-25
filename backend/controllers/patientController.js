const Patient = require('../models/Patient');
const MedicalRecord = require('../models/MedicalRecord');

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('assignedDoctor', 'firstName lastName specialization')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single patient
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('assignedDoctor', 'firstName lastName specialization phone');
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create patient
exports.createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: patient
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create patient',
      error: error.message
    });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update patient',
      error: error.message
    });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get patient's medical history
exports.getPatientMedicalHistory = async (req, res) => {
  try {
    const medicalRecords = await MedicalRecord.find({ patient: req.params.id })
      .populate('doctor', 'firstName lastName specialization')
      .sort({ visitDate: -1 });
    
    res.json({
      success: true,
      count: medicalRecords.length,
      data: medicalRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Search patients
exports.searchPatients = async (req, res) => {
  try {
    const { search } = req.query;
    
    const patients = await Patient.find({
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]
    }).limit(20);
    
    res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
