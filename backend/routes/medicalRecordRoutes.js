const express = require('express');
const router = express.Router();
const {
  getAllMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  getRecordsByPatient,
  getRecordsByDoctor
} = require('../controllers/medicalRecordController');

// Routes
router.route('/')
  .get(getAllMedicalRecords)
  .post(createMedicalRecord);

router.get('/patient/:patientId', getRecordsByPatient);
router.get('/doctor/:doctorId', getRecordsByDoctor);

router.route('/:id')
  .get(getMedicalRecordById)
  .put(updateMedicalRecord)
  .delete(deleteMedicalRecord);

module.exports = router;
