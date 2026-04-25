const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
  getUpcomingAppointments
} = require('../controllers/appointmentController');

// Routes
router.route('/')
  .get(getAllAppointments)
  .post(createAppointment);

router.get('/upcoming', getUpcomingAppointments);

router.route('/:id')
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(deleteAppointment);

router.put('/:id/cancel', cancelAppointment);

module.exports = router;
