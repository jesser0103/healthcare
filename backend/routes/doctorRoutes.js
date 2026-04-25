const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorAppointments,
  getDoctorsBySpecialization
} = require('../controllers/doctorController');

// Routes
router.route('/')
  .get(getAllDoctors)
  .post(createDoctor);

router.get('/specialization/:specialization', getDoctorsBySpecialization);

router.route('/:id')
  .get(getDoctorById)
  .put(updateDoctor)
  .delete(deleteDoctor);

router.get('/:id/appointments', getDoctorAppointments);

module.exports = router;
