# HOW TO ADD THIS PROJECT TO WEBSTORM

## Quick Start Guide

### Step 1: Extract the ZIP File
1. Download the `healthcare-system.zip` file
2. Right-click and select "Extract All" (Windows) or double-click (Mac)
3. Extract to a location like `C:\Users\YourName\WebstormProjects\`

### Step 2: Open in WebStorm
1. Open **WebStorm**
2. Click **File → Open**
3. Navigate to the extracted `healthcare-system` folder
4. Click **OK**

### Step 3: Install Dependencies
1. Open the **Terminal** in WebStorm (bottom toolbar or `Alt+F12`)
2. Run:
   ```bash
   npm install
   ```
3. Wait for all packages to download (this may take 1-2 minutes)

### Step 4: Start MongoDB
1. Make sure **Docker Desktop** is running
2. In the Terminal, run:
   ```bash
   docker-compose up -d
   ```
3. Verify MongoDB is running:
   ```bash
   docker ps
   ```
   You should see a container named `mongodb`

### Step 5: Start the Application
1. In the Terminal, run:
   ```bash
   npm run dev
   ```
2. You should see:
   ```
   MongoDB connected successfully
   Healthcare API running in development mode on port 3000
   ```

### Step 6: Test the API
1. Open your browser and go to: `http://localhost:3000`
2. You should see a JSON response with the API information

**OR**

1. Open `api-tests.http` file in WebStorm
2. Click the green play button (▶) next to any request
3. View the response in the bottom panel

---

## Detailed Testing Steps

### Create a Doctor (First)
1. Open `api-tests.http`
2. Find the "Create a doctor" request
3. Click the green play button
4. Copy the `"_id"` from the response (this is the DOCTOR_ID)

### Create a Patient (Second)
1. Find the "Create a patient" request
2. Click the green play button
3. Copy the `"_id"` from the response (this is the PATIENT_ID)

### Create an Appointment (Third)
1. Find the "Create an appointment" request
2. Replace `PATIENT_ID_HERE` with your patient ID
3. Replace `DOCTOR_ID_HERE` with your doctor ID
4. Click the green play button

### Create a Medical Record (Fourth)
1. Find the "Create a medical record" request
2. Replace `PATIENT_ID_HERE` with your patient ID
3. Replace `DOCTOR_ID_HERE` with your doctor ID
4. Click the green play button

---

## Troubleshooting

### Problem: "Cannot connect to MongoDB"
**Solution:**
1. Make sure Docker Desktop is running
2. Run: `docker-compose up -d`
3. Wait 30 seconds for MongoDB to start
4. Run: `npm run dev` again

### Problem: "Port 3000 is already in use"
**Solution:**
1. Stop any other application using port 3000
2. Or change the port in `.env` file:
   ```
   PORT=4000
   ```

### Problem: "Module not found"
**Solution:**
1. Delete `node_modules` folder
2. Run: `npm install`

### Problem: "Docker command not found"
**Solution:**
1. Install Docker Desktop from: https://www.docker.com/products/docker-desktop/
2. Restart your computer
3. Make sure Docker Desktop is running

---

## Project Structure Explained

```
healthcare-system/
├── config/              # Database configuration
├── models/              # Database schemas (Patient, Doctor, etc.)
├── controllers/         # Business logic (what happens when you call an API)
├── routes/              # API endpoints (URLs)
├── middleware/          # Helper functions
├── server.js            # Main application file (START HERE)
├── .env                 # Configuration (ports, database URL)
├── docker-compose.yml   # MongoDB setup
├── package.json         # Dependencies list
└── api-tests.http       # Test requests
```

---

## Useful Commands

```bash
# Install packages
npm install

# Start MongoDB
docker-compose up -d

# Stop MongoDB
docker-compose down

# Start the app
npm run dev

# Start the app (production)
npm start

# View MongoDB data
docker exec -it mongodb mongosh -u admin -p password123

# Check if MongoDB is running
docker ps

# View app logs
# Just look at the terminal output
```

---

## Next Steps After Setup

1. ✅ Create some doctors
2. ✅ Create some patients
3. ✅ Create appointments
4. ✅ Create medical records
5. ✅ Try searching for patients
6. ✅ Get a patient's medical history

---

## Video Tutorial (Recommended)

If you prefer video, search YouTube for:
- "Express.js REST API tutorial"
- "Node.js MongoDB CRUD tutorial"

---

## Need Help?

- Check the `README.md` file for detailed documentation
- Read error messages carefully - they usually tell you what's wrong
- Make sure Docker Desktop is running before starting

---

## Success Checklist

- [ ] Extracted the ZIP file
- [ ] Opened project in WebStorm
- [ ] Ran `npm install`
- [ ] Started Docker Desktop
- [ ] Ran `docker-compose up -d`
- [ ] Ran `npm run dev`
- [ ] Visited http://localhost:3000
- [ ] Tested API with `api-tests.http`

If all checkboxes are complete, you're good to go! 🎉
