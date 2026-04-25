const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Get all medical records
exports.getAllMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find()
      .populate('patient', 'firstName lastName email')
      .populate('doctor', 'firstName lastName specialization')
      .sort({ visitDate: -1 });
    
    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single medical record
exports.getMedicalRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient')
      .populate('doctor')
      .populate('appointment');
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }
    
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create medical record
exports.createMedicalRecord = async (req, res) => {
  try {
    const { patient, doctor } = req.body;
    
    // Verify patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    // Verify doctor exists
    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    const record = await MedicalRecord.create(req.body);
    
    await record.populate('patient', 'firstName lastName email');
    await record.populate('doctor', 'firstName lastName specialization');
    
    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      data: record
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create medical record',
      error: error.message
    });
  }
};

// Update medical record
exports.updateMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('patient', 'firstName lastName email')
      .populate('doctor', 'firstName lastName specialization');
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Medical record updated successfully',
      data: record
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update medical record',
      error: error.message
    });
  }
};

// Delete medical record
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Medical record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get records by patient
exports.getRecordsByPatient = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.params.patientId })
      .populate('doctor', 'firstName lastName specialization')
      .sort({ visitDate: -1 });
    
    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get records by doctor
exports.getRecordsByDoctor = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ doctor: req.params.doctorId })
      .populate('patient', 'firstName lastName email')
      .sort({ visitDate: -1 });
    
    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
