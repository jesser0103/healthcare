require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { logger } = require('./middleware/auth');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const mongoose = require('mongoose');
const { metricsMiddleware, metricsHandler } = require('./middleware/metrics');

// Import routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const labTestRoutes = require('./routes/labTestRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(metricsMiddleware);
app.use(logger);

app.get('/health', async (req, res) => {
  const region = process.env.REGION || 'unknown';
  const uptime = process.uptime();

  const mongoReadyState = mongoose.connection?.readyState;
  const mongoConnected = mongoReadyState === 1;

  let replicaSetStatus = null;

  if (mongoConnected && mongoose.connection?.db) {
    try {
      const adminDb = mongoose.connection.db.admin();
      const status = await adminDb.command({ replSetGetStatus: 1 });

      const members = Array.isArray(status.members) ? status.members : [];
      const primary = members.find((m) => m.stateStr === 'PRIMARY');
      const secondaries = members.filter((m) => m.stateStr === 'SECONDARY');
      const arbiters = members.filter((m) => m.stateStr === 'ARBITER');

      const primaryOptime = primary?.optimeDate ? new Date(primary.optimeDate).getTime() : null;
      const maxLagSeconds = primaryOptime
        ? Math.max(
            0,
            ...secondaries
              .map((s) => (s.optimeDate ? (primaryOptime - new Date(s.optimeDate).getTime()) / 1000 : 0))
              .filter((v) => Number.isFinite(v))
          )
        : null;

      replicaSetStatus = {
        set: status.set,
        myState: status.myState,
        primary: primary?.name || null,
        secondaries: secondaries.map((s) => s.name),
        arbiters: arbiters.map((a) => a.name),
        replicationLagSeconds: maxLagSeconds
      };
    } catch (e) {
      replicaSetStatus = {
        error: 'replSetGetStatus failed'
      };
    }
  }

  const status = mongoConnected ? 'ok' : 'degraded';

  res.status(mongoConnected ? 200 : 503).json({
    status,
    region,
    mongodb: mongoConnected ? 'connected' : 'disconnected',
    replicaSetStatus,
    timestamp: new Date().toISOString(),
    uptime
  });
});

app.get('/metrics', metricsHandler);

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Enhanced Healthcare Management System API',
    version: '2.0.0',
    features: [
      'Authentication & Authorization',
      'Prescription Management',
      'Lab Tests',
      'Billing & Invoicing',
      'Notifications',
      'File Uploads',
      'Video Consultations',
      'Patient Portal'
    ],
    endpoints: {
      auth: '/api/auth',
      patients: '/api/patients',
      doctors: '/api/doctors',
      appointments: '/api/appointments',
      medicalRecords: '/api/medical-records',
      prescriptions: '/api/prescriptions',
      labTests: '/api/lab-tests',
      invoices: '/api/invoices'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/lab-tests', labTestRoutes);
app.use('/api/invoices', invoiceRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`Enhanced Healthcare API is running!`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Port: ${PORT}`);
  console.log(`========================================`);
  console.log(`Endpoints available:`);
  console.log(`- POST /api/auth/register - Register`);
  console.log(`- POST /api/auth/login - Login`);
  console.log(`- GET /api/auth/me - Get current user`);
  console.log(`========================================`);
});
