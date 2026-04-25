const Prescription = require('../models/Prescription');

exports.getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patient', 'firstName lastName email')
      .populate('doctor', 'firstName lastName specialization')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.createPrescription = async (req, res) => {
  try {
    if (!req.body.validUntil) {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);
      req.body.validUntil = validUntil;
    }
    
    const prescription = await Prescription.create(req.body);
    
    await prescription.populate('patient', 'firstName lastName email phone');
    await prescription.populate('doctor', 'firstName lastName specialization');
    
    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: prescription
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create prescription',
      error: error.message
    });
  }
};

exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient')
      .populate('doctor');
    
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }
    
    res.json({
      success: true,
      data: prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.getPrescriptionsByPatient = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.patientId })
      .populate('doctor', 'firstName lastName specialization')
      .sort({ prescriptionDate: -1 });
    
    res.json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
