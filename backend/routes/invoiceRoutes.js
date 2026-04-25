const express = require('express');
const router = express.Router();

const {
  getAllInvoices,
  getInvoiceById,
  createInvoice
} = require('../controllers/invoiceController');

router.route('/')
  .get(getAllInvoices)
  .post(createInvoice);

router.route('/:id')
  .get(getInvoiceById);

module.exports = router;
