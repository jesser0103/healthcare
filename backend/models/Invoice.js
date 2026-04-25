const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  invoiceNumber: {
    type: String,
    unique: true,
    required: true
  },
  invoiceDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  items: [{
    type: {
      type: String,
      enum: ['Consultation', 'Procedure', 'Lab Test', 'Prescription', 'Room Charge', 'Other'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  totalDiscount: {
    type: Number,
    default: 0
  },
  totalTax: {
    type: Number,
    default: 0
  },
  grandTotal: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Unpaid'
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    required: true
  },
  payments: [{
    paymentDate: {
      type: Date,
      default: Date.now
    },
    amount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'Insurance', 'Bank Transfer', 'Online', 'Other']
    },
    transactionId: String,
    notes: String
  }],
  insurance: {
    provider: String,
    policyNumber: String,
    claimNumber: String,
    coverageAmount: Number,
    claimStatus: {
      type: String,
      enum: ['Not Filed', 'Filed', 'Approved', 'Rejected', 'Pending']
    }
  },
  notes: String,
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Viewed', 'Paid', 'Cancelled'],
    default: 'Draft'
  }
}, {
  timestamps: true
});

invoiceSchema.pre('validate', function(next) {
  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.invoiceNumber = `INV${year}${month}${random}`;
  }
  next();
});

invoiceSchema.pre('save', function(next) {
  this.balance = this.grandTotal - this.paidAmount;
  if (this.balance === 0) {
    this.paymentStatus = 'Paid';
  } else if (this.paidAmount > 0 && this.balance > 0) {
    this.paymentStatus = 'Partially Paid';
  } else if (this.balance > 0 && new Date() > this.dueDate) {
    this.paymentStatus = 'Overdue';
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
