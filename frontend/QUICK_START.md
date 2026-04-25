# ⚡ QUICK START - React Frontend

Get your React frontend running in 5 minutes!

## ✅ Prerequisites Checklist

- [x] Node.js installed (v16+)
- [x] Backend API running on http://localhost:3000
- [x] Terminal/Command Prompt open

---

## 🚀 Setup (3 Minutes)

### Step 1: Install Dependencies (2 min)
```bash
npm install
```

Wait for installation to complete...

### Step 2: Start Development Server (30 sec)
```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3001/
  ➜  press h to show help
```

### Step 3: Open in Browser (10 sec)
```
http://localhost:3001
```

✅ **SUCCESS! Your React app is running!**

---

## 🧪 Test It (2 Minutes)

### Test 1: View Login Page
You should see a beautiful login page with:
- Healthcare logo
- Email and Password fields
- "Sign In" button
- "Don't have an account? Sign Up" link

### Test 2: Login
**Use existing account from backend:**
```
Email: dr.smith@hospital.com
Password: doctor123
```

Click "Sign In"

### Test 3: View Dashboard
You should be redirected to the Doctor Dashboard showing:
- Welcome message
- Statistics cards
- Today's appointments
- Recent patients

🎉 **Everything works!**

---

## 🎯 Quick Tour

### 1. Login Page (`/login`)
- Clean, professional design
- Material-UI components
- Form validation

### 2. Register Page (`/register`)
- Role selection (Doctor/Patient)
- Different fields based on role
- Password confirmation

### 3. Dashboard (`/dashboard`)
**Doctor View:**
- Total patients count
- Today's appointments
- Prescriptions count
- Quick actions

**Patient View:**
- Upcoming appointments
- Active prescriptions
- Lab tests
- Invoices

### 4. Sidebar Navigation
- Dashboard
- Patients (Doctor only)
- Appointments
- Prescriptions
- Lab Tests

### 5. Header
- App title
- User email
- Logout button

---

## 📝 Test Scenarios

### Scenario 1: Doctor Login
```bash
1. Go to http://localhost:3001/login
2. Enter: dr.smith@hospital.com / doctor123
3. Click "Sign In"
4. See Doctor Dashboard
5. Click "Patients" in sidebar
6. See list of patients
```

### Scenario 2: Register New Doctor
```bash
1. Go to http://localhost:3001/register
2. Select role: "Doctor"
3. Fill in:
   - First Name: Jane
   - Last Name: Wilson
   - Email: dr.wilson@hospital.com
   - Phone: +1234567890
   - Specialization: Pediatrics
   - License: MD789012
   - Password: doctor123
   - Confirm Password: doctor123
4. Click "Sign Up"
5. Should create account and login automatically
```

### Scenario 3: View Prescriptions
```bash
1. Login as doctor
2. Click "Prescriptions" in sidebar
3. See list of prescriptions
4. Each prescription shows:
   - Prescription number
   - Patient name
   - Date
   - Medications count
   - Status (Active/Completed)
```

---

## 🎨 UI Components Used

| Component | Purpose |
|-----------|---------|
| AppBar | Top navigation bar |
| Drawer | Sidebar menu |
| Card | Statistics cards |
| Table | Data tables |
| TextField | Input fields |
| Button | Action buttons |
| Chip | Status badges |
| Paper | Content containers |

---

## 🔧 Configuration

### Port Configuration
Default: `http://localhost:3001`

To change, edit `vite.config.js`:
```javascript
server: {
  port: 3001, // Change this
}
```

### API Configuration
Backend URL: `http://localhost:3000`

Configured in `vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true
  }
}
```

---

## 🐛 Common Issues & Fixes

### Issue: "npm install" fails
**Fix:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Issue: "Port 3001 already in use"
**Fix:**
```bash
# Kill process on port 3001
# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3001 | xargs kill
```

### Issue: "Cannot connect to backend"
**Fix:**
1. Make sure backend is running: `http://localhost:3000`
2. Check backend terminal for errors
3. Try: `http://localhost:3000` in browser - should show API info

### Issue: "Login fails"
**Fix:**
1. Check backend is running
2. Open browser console (F12)
3. Check Network tab for API errors
4. Make sure account exists in backend

### Issue: "Blank page after login"
**Fix:**
1. Open browser console (F12)
2. Check for JavaScript errors
3. Try: Clear cache and hard reload (Ctrl+Shift+R)

---

## 💡 Pro Tips

### Tip 1: Keep Backend Running
Always start backend FIRST, then frontend:
```bash
# Terminal 1 - Backend
cd healthcare-enhanced
npm run dev

# Terminal 2 - Frontend
cd healthcare-frontend
npm run dev
```

### Tip 2: Browser DevTools
Press **F12** to open DevTools:
- **Console**: See errors and logs
- **Network**: See API calls
- **Application**: See localStorage (token)

### Tip 3: Hot Reload
Vite has instant hot reload - just save files and see changes immediately!

### Tip 4: Test Accounts
Create test accounts for testing:
- Doctor: `test.doctor@hospital.com`
- Patient: `test.patient@email.com`
- Password: `test123`

---

## 📚 File Overview

```
Key Files:
├── src/
│   ├── App.jsx              ← Routes & theme
│   ├── main.jsx             ← Entry point
│   ├── context/
│   │   └── AuthContext.jsx  ← Login/logout logic
│   ├── pages/
│   │   ├── Login.jsx        ← Login page
│   │   ├── Register.jsx     ← Registration
│   │   ├── DoctorDashboard  ← Doctor dashboard
│   │   └── PatientDashboard ← Patient dashboard
│   ├── services/
│   │   └── api.js           ← API calls
│   └── components/
│       └── Layout.jsx       ← Sidebar & header

Config Files:
├── vite.config.js           ← Vite config
├── package.json             ← Dependencies
└── index.html               ← HTML template
```

---

## 🎓 Next Steps

### Learn More:
1. **Explore the Code**
   - Open files in `src/pages/`
   - See how components work

2. **Customize**
   - Change colors in `App.jsx`
   - Modify sidebar in `Layout.jsx`

3. **Add Features**
   - Add new pages
   - Create new components

4. **Deploy**
   - Build: `npm run build`
   - Deploy to Vercel/Netlify

---

## 🎯 Success Checklist

- [ ] `npm install` completed
- [ ] `npm run dev` running
- [ ] Can open http://localhost:3001
- [ ] Can see login page
- [ ] Can login with test account
- [ ] Can see dashboard
- [ ] Can navigate sidebar
- [ ] Can logout

If all checked, you're ready! 🎉

---

## 📞 Need Help?

**Quick Debugging:**
```bash
# Check if Node.js installed
node --version

# Check if npm installed
npm --version

# Check what's running on port 3001
# Windows:
netstat -ano | findstr :3001

# Mac/Linux:
lsof -i :3001
```

---

**That's it! Your React frontend is ready to use! 🚀**

Remember: Backend must be running on port 3000 for the frontend to work!
