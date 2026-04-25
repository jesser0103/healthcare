# Healthcare Management System API

A complete REST API for managing healthcare operations including patients, doctors, appointments, and medical records.

## Features

- ✅ Patient Management
- ✅ Doctor Profiles & Availability
- ✅ Appointment Scheduling
- ✅ Medical Records
- ✅ Search Functionality
- ✅ MongoDB Database with Docker
- ✅ Complete CRUD Operations

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Docker** - MongoDB containerization

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- Docker Desktop (for MongoDB)
- WebStorm or any IDE

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start MongoDB with Docker

```bash
docker-compose up -d
```

Verify MongoDB is running:
```bash
docker ps
```

### Step 3: Start the Application

```bash
npm run dev
```

The API will be available at: `http://localhost:3000`

## API Endpoints

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create new patient
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/search?search=query` - Search patients
- `GET /api/patients/:id/medical-history` - Get patient's medical history

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Create new doctor
- `GET /api/doctors/:id` - Get doctor by ID
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor
- `GET /api/doctors/specialization/:specialization` - Get doctors by specialization
- `GET /api/doctors/:id/appointments` - Get doctor's appointments

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment
- `GET /api/appointments/upcoming` - Get upcoming appointments
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Medical Records
- `GET /api/medical-records` - Get all medical records
- `POST /api/medical-records` - Create new medical record
- `GET /api/medical-records/:id` - Get medical record by ID
- `PUT /api/medical-records/:id` - Update medical record
- `DELETE /api/medical-records/:id` - Delete medical record
- `GET /api/medical-records/patient/:patientId` - Get records by patient
- `GET /api/medical-records/doctor/:doctorId` - Get records by doctor

## Testing the API

### Using WebStorm HTTP Client

1. Open `api-tests.http` in WebStorm
2. Click the green play button next to each request
3. View responses in the bottom panel

### Using Postman or curl

Import the endpoints from the README or use curl:

```bash
# Create a doctor
curl -X POST http://localhost:3000/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "dr.sarah@hospital.com",
    "phone": "+1234567890",
    "specialization": "Cardiology",
    "licenseNumber": "MD123456"
  }'
```

## Project Structure

```
healthcare-system/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── Patient.js           # Patient schema
│   ├── Doctor.js            # Doctor schema
│   ├── Appointment.js       # Appointment schema
│   └── MedicalRecord.js     # Medical record schema
├── controllers/
│   ├── patientController.js
│   ├── doctorController.js
│   ├── appointmentController.js
│   └── medicalRecordController.js
├── routes/
│   ├── patientRoutes.js
│   ├── doctorRoutes.js
│   ├── appointmentRoutes.js
│   └── medicalRecordRoutes.js
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── errorHandler.js      # Error handling
├── .env                      # Environment variables
├── .gitignore
├── docker-compose.yml        # MongoDB Docker config
├── package.json
├── server.js                 # Main application file
└── api-tests.http           # API test requests
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://admin:password123@localhost:27017/myapp?authSource=admin
```

## Docker Commands

```bash
# Start MongoDB
docker-compose up -d

# Stop MongoDB
docker-compose down

# View MongoDB logs
docker-compose logs -f mongodb

# Access MongoDB shell
docker exec -it mongodb mongosh -u admin -p password123
```

## Common Issues & Solutions

### MongoDB Connection Error
- **Problem**: Cannot connect to MongoDB
- **Solution**: Make sure Docker Desktop is running and MongoDB container is started
  ```bash
  docker-compose up -d
  docker ps
  ```

### Port Already in Use
- **Problem**: Port 3000 or 27017 is already in use
- **Solution**: Change the port in `.env` file or stop the conflicting service

### Module Not Found
- **Problem**: Cannot find module errors
- **Solution**: Run `npm install` again

## Next Steps

Consider adding:
- JWT Authentication
- Input Validation (using express-validator)
- File Upload for medical documents
- Email notifications
- Patient/Doctor dashboards (Frontend)
- Prescription management
- Lab test results

## License

ISC

## Author

Your Name

## Support

For issues or questions, please create an issue in the repository.
