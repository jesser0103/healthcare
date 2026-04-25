const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo-primary:27017,mongo-secondary:27017/healthdb?replicaSet=rs0';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear existing to avoid duplicate key errors for this email
    await User.deleteOne({ email: 'dr.smith@hospital.com' });
    await Doctor.deleteOne({ email: 'dr.smith@hospital.com' });

    // Create doctor profile
    const doctorProfile = await Doctor.create({
      firstName: 'John',
      lastName: 'Smith',
      email: 'dr.smith@hospital.com',
      phone: '555-0100',
      specialization: 'Cardiology',
      licenseNumber: 'MD-12345'
    });

    // Create user
    await User.create({
      email: 'dr.smith@hospital.com',
      password: 'doctor123',
      role: 'doctor',
      doctorProfile: doctorProfile._id
    });

    console.log('Successfully created test doctor: dr.smith@hospital.com / doctor123');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error seeding DB:', err);
    process.exit(1);
  });
