# ⚡ QUICK START - Get Running in 5 Minutes!

## ✅ Checklist

- [ ] Node.js installed
- [ ] Docker Desktop installed and running
- [ ] WebStorm (or any code editor)

---

## 🚀 Step-by-Step

### 1. Extract & Open (30 seconds)
1. Extract ZIP file
2. Open folder in WebStorm
3. Open Terminal (Alt+F12 or bottom toolbar)

### 2. Install Dependencies (2 minutes)
```bash
npm install
```
Wait for installation to complete...

### 3. Update Configuration (30 seconds)
Open `.env` file and change:
```env
JWT_SECRET=my-secret-key-123456789
```
(Just change it to any random string)

### 4. Start Database (1 minute)
```bash
docker-compose up -d
```
Wait 30 seconds for MongoDB to start...

### 5. Start Application (30 seconds)
```bash
npm run dev
```

You should see:
```
========================================
Enhanced Healthcare API is running!
Environment: development
Port: 3000
========================================
```

✅ **SUCCESS! Your app is running!**

---

## 🧪 Test It (2 Minutes)

### Test 1: Open in Browser
```
http://localhost:3000
```
You should see API information

### Test 2: Register a Doctor
1. Open `auth-tests.http`
2. Find "Register a Doctor"
3. Click the green ▶ button
4. Copy the `token` from response

**Response will look like:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1234567890abcdef12345",
    "email": "dr.smith@hospital.com",
    "role": "doctor"
  }
}
```

### Test 3: Register a Patient
1. Find "Register a Patient" in `auth-tests.http`
2. Click ▶
3. Copy the `token` and patient `id`

### Test 4: Create a Prescription
1. Open `prescription-tests.http`
2. Replace `YOUR_DOCTOR_TOKEN_HERE` with doctor's token
3. Replace `PATIENT_ID_HERE` with patient's id
4. Replace `DOCTOR_ID_HERE` with doctor's id
5. Click ▶

🎉 **Success! You just created a digital prescription!**

---

## 📋 What You Have Now

### ✅ Working Features
- User registration (doctors & patients)
- Login with JWT authentication
- Prescription management
- Patient management
- Doctor management
- Appointments
- Medical records

### 🔐 Authentication
Every request needs a token:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🎯 Common Tasks

### Task: Register New User
```bash
Open: auth-tests.http
Find: "Register a Doctor" or "Register a Patient"
Click: ▶
```

### Task: Login
```bash
Open: auth-tests.http
Find: "Login as Doctor"
Update: email and password
Click: ▶
Copy: the token
```

### Task: Create Prescription
```bash
Open: prescription-tests.http
Replace: YOUR_DOCTOR_TOKEN_HERE
Replace: PATIENT_ID and DOCTOR_ID
Click: ▶
```

### Task: View All Prescriptions
```bash
Open: prescription-tests.http
Find: "Get All Prescriptions"
Replace: YOUR_TOKEN_HERE
Click: ▶
```

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to MongoDB"
**Solution:**
```bash
# Check if Docker is running
docker ps

# If not running, start it
docker-compose up -d

# Wait 30 seconds, then
npm run dev
```

### Problem: "JWT_SECRET required"
**Solution:**
- Open `.env`
- Change `JWT_SECRET` to any random string
- Restart: `npm run dev`

### Problem: "Port 3000 already in use"
**Solution:**
- Open `.env`
- Change `PORT=3000` to `PORT=4000`
- Restart: `npm run dev`

### Problem: "Module not found"
**Solution:**
```bash
npm install
```

### Problem: "Invalid token"
**Solution:**
- You need to login first to get a token
- Copy the token from login response
- Use it in the Authorization header

---

## 💡 Pro Tips

1. **Save your tokens!** - Copy them to a text file
2. **One token per role** - Doctor tokens can't be used for patient actions
3. **Tokens expire** - Default is 7 days, then login again
4. **Read error messages** - They tell you exactly what's wrong
5. **Use .http files** - Easier than Postman for quick tests

---

## 📖 Next Steps

### Beginner Path
1. ✅ Complete Quick Start (you're here!)
2. Test all endpoints in `auth-tests.http`
3. Test prescriptions in `prescription-tests.http`
4. Read `README_ENHANCED.md` for more features

### Intermediate Path
1. Add more features (lab tests, billing)
2. Setup email notifications
3. Create custom endpoints
4. Build a simple frontend

### Advanced Path
1. Deploy to production
2. Add payment processing
3. Implement video consultations
4. Build mobile app

---

## 🎓 Understanding the Flow

```
1. User registers → Get account
2. User logs in → Get token
3. User makes requests → Include token
4. Server verifies token → Allow/deny access
```

**Example:**
```
Register Doctor → Token ABC
Register Patient → Token XYZ

Create Prescription with Token ABC → ✅ (doctor can)
Create Prescription with Token XYZ → ❌ (patient can't)
```

---

## 📞 Need Help?

1. **Check the error message** - 90% of problems are explained there
2. **Read README_ENHANCED.md** - Complete documentation
3. **Try the examples** - All .http files have working examples
4. **Check your tokens** - Make sure you're using the right token

---

## 🎉 You're All Set!

You now have:
- ✅ Healthcare API running
- ✅ Authentication working
- ✅ Prescriptions working
- ✅ All original features working

**Start building! 🚀**

---

**Quick Commands:**
```bash
# Start everything
docker-compose up -d && npm run dev

# Stop everything
docker-compose down

# Restart app
# Ctrl+C in terminal, then: npm run dev
```
