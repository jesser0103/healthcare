const Invoice = require('../models/Invoice');
const Patient = require('../models/Patient');

const computeInvoiceTotals = (items = []) => {
  const normalizedItems = (items || []).map((item) => {
    const quantity = Number(item.quantity ?? 1);
    const unitPrice = Number(item.unitPrice ?? 0);
    const discount = Number(item.discount ?? 0);
    const tax = Number(item.tax ?? 0);

    const lineBase = quantity * unitPrice;
    const lineTotal = lineBase - discount + tax;

    return {
      ...item,
      quantity,
      unitPrice,
      discount,
      tax,
      total: Number(item.total ?? lineTotal)
    };
  });

  const subtotal = normalizedItems.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0);
  const totalDiscount = normalizedItems.reduce((sum, i) => sum + (i.discount || 0), 0);
  const totalTax = normalizedItems.reduce((sum, i) => sum + (i.tax || 0), 0);
  const grandTotal = normalizedItems.reduce((sum, i) => sum + (i.total || 0), 0);

  return { normalizedItems, subtotal, totalDiscount, totalTax, grandTotal };
};

// Get all invoices (optional filters: patient, paymentStatus, status)
exports.getAllInvoices = async (req, res) => {
  try {
    const query = {};

    if (req.query.patient) query.patient = req.query.patient;
    if (req.query.paymentStatus) query.paymentStatus = req.query.paymentStatus;
    if (req.query.status) query.status = req.query.status;

    const invoices = await Invoice.find(query)
      .populate('patient', 'firstName lastName email phone')
      .sort({ invoiceDate: -1, createdAt: -1 });

    res.json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single invoice
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('patient');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create invoice
exports.createInvoice = async (req, res) => {
  try {
    const { patient, dueDate, items, paidAmount } = req.body;

    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Due date is required'
      });
    }

    const { normalizedItems, subtotal, totalDiscount, totalTax, grandTotal } = computeInvoiceTotals(items);

    const invoicePayload = {
      ...req.body,
      items: normalizedItems,
      subtotal: req.body.subtotal ?? subtotal,
      totalDiscount: req.body.totalDiscount ?? totalDiscount,
      totalTax: req.body.totalTax ?? totalTax,
      grandTotal: req.body.grandTotal ?? grandTotal,
      paidAmount: Number(paidAmount ?? 0),
      balance: Number(req.body.balance ?? (Number(req.body.grandTotal ?? grandTotal) - Number(paidAmount ?? 0)))
    };

    const invoice = await Invoice.create(invoicePayload);
    await invoice.populate('patient', 'firstName lastName email phone');

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: invoice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create invoice',
      error: error.message
    });
  }
};
