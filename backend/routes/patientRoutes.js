const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientMedicalHistory,
  searchPatients
} = require('../controllers/patientController');

// Routes
router.route('/')
  .get(getAllPatients)
  .post(createPatient);

router.get('/search', searchPatients);

router.route('/:id')
  .get(getPatientById)
  .put(updatePatient)
  .delete(deletePatient);

router.get('/:id/medical-history', getPatientMedicalHistory);

module.exports = router;
