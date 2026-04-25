const LabTest = require('../models/LabTest');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Get all lab tests (optional filters: patient, doctor, status)
exports.getAllLabTests = async (req, res) => {
  try {
    const query = {};

    if (req.query.patient) query.patient = req.query.patient;
    if (req.query.doctor) query.doctor = req.query.doctor;
    if (req.query.status) query.status = req.query.status;

    const labTests = await LabTest.find(query)
      .populate('patient', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName specialization')
      .sort({ orderedDate: -1, createdAt: -1 });

    res.json({
      success: true,
      count: labTests.length,
      data: labTests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single lab test
exports.getLabTestById = async (req, res) => {
  try {
    const labTest = await LabTest.findById(req.params.id)
      .populate('patient')
      .populate('doctor');

    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: 'Lab test not found'
      });
    }

    res.json({
      success: true,
      data: labTest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create lab test order
exports.createLabTest = async (req, res) => {
  try {
    const { patient, doctor } = req.body;

    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const labTest = await LabTest.create(req.body);

    await labTest.populate('patient', 'firstName lastName email phone');
    await labTest.populate('doctor', 'firstName lastName specialization');

    res.status(201).json({
      success: true,
      message: 'Lab test ordered successfully',
      data: labTest
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create lab test',
      error: error.message
    });
  }
};
