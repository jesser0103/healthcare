const express = require('express');
const router = express.Router();
const {
  getAllPrescriptions,
  createPrescription,
  getPrescriptionById,
  getPrescriptionsByPatient
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getAllPrescriptions)
  .post(protect, authorize('doctor'), createPrescription);

router.get('/:id', protect, getPrescriptionById);
router.get('/patient/:patientId', protect, getPrescriptionsByPatient);

module.exports = router;
