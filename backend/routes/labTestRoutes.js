const express = require('express');
const router = express.Router();

const {
  getAllLabTests,
  getLabTestById,
  createLabTest
} = require('../controllers/labTestController');

router.route('/')
  .get(getAllLabTests)
  .post(createLabTest);

router.route('/:id')
  .get(getLabTestById);

module.exports = router;
