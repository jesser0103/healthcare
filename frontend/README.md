# 🏥 Healthcare Frontend - React Application

Modern, responsive React frontend for the Healthcare Management System.

## ✨ Features

### 🔐 Authentication
- User Login (Doctor/Patient/Admin)
- User Registration
- JWT Token Management
- Protected Routes
- Auto-redirect based on role

### 👨‍⚕️ Doctor Portal
- **Dashboard** - Overview of patients, appointments, stats
- **Patients List** - View and search all patients
- **Prescriptions** - Create and manage prescriptions
- **Appointments** - View and manage appointments
- **Lab Tests** - Order and view lab results

### 👤 Patient Portal
- **Dashboard** - Personal health overview
- **My Appointments** - View upcoming appointments
- **My Prescriptions** - View active prescriptions
- **Lab Results** - Access test results
- **Invoices** - View and pay bills

### 🎨 UI/UX
- Material-UI Design System
- Responsive (Mobile, Tablet, Desktop)
- Clean, professional healthcare interface
- Intuitive navigation
- Real-time updates

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Backend API running on `http://localhost:3000`

### Installation

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The app will open at: **http://localhost:3001**

---

## 📁 Project Structure

```
healthcare-frontend/
├── public/
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Main layout with sidebar
│   │
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication state
│   │
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   ├── DoctorDashboard.jsx # Doctor dashboard
│   │   ├── PatientDashboard.jsx # Patient dashboard
│   │   ├── Patients.jsx        # Patients list
│   │   └── Prescriptions.jsx   # Prescriptions list
│   │
│   ├── services/
│   │   └── api.js              # API calls to backend
│   │
│   ├── utils/
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
│
├── index.html
├── package.json
├── vite.config.js              # Vite configuration
└── README.md
```

---

## 🔑 Login Credentials

### Test Accounts

**Doctor Account:**
```
Email: dr.smith@hospital.com
Password: doctor123
```

**Patient Account:**
```
Email: jane.doe@email.com
Password: patient123
```

Or register a new account at `/register`

---

## 🌐 API Configuration

The frontend connects to the backend API running at `http://localhost:3000`

**Configuration in `vite.config.js`:**
```javascript
server: {
  port: 3001,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

---

## 🎯 Available Routes

### Public Routes
- `/login` - User login
- `/register` - User registration

### Protected Routes (Require Authentication)
- `/dashboard` - Role-based dashboard
- `/patients` - Patients list (Doctor only)
- `/prescriptions` - Prescriptions management
- `/appointments` - Appointments management
- `/lab-tests` - Lab tests (Coming soon)
- `/invoices` - Billing (Coming soon)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **Vite** | Build tool (super fast!) |
| **Material-UI** | Component library |
| **React Router** | Navigation |
| **Axios** | HTTP client |
| **Context API** | State management |

---

## 📦 Key Dependencies

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "@mui/material": "^5.14.20",
  "@mui/icons-material": "^5.14.19",
  "axios": "^1.6.2"
}
```

---

## 🎨 Customization

### Change Theme Colors

Edit `src/App.jsx`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Change to your color
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
```

### Add New Page

1. Create file in `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`
3. Add to sidebar in `src/components/Layout.jsx`

---

## 🔐 Authentication Flow

```
1. User visits /login
2. Enters credentials
3. Frontend sends to POST /api/auth/login
4. Backend returns JWT token
5. Token stored in localStorage
6. Token added to all API requests
7. User redirected to /dashboard
```

### Token Management

```javascript
// Login
const { token, user } = await login(email, password);
localStorage.setItem('token', token);

// API calls include token
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Logout
localStorage.removeItem('token');
```

---

## 📱 Responsive Design

The app is fully responsive:

- **Mobile** (< 600px): Hamburger menu, stacked layout
- **Tablet** (600-960px): Collapsible sidebar
- **Desktop** (> 960px): Fixed sidebar

---

## 🧪 Testing

### Manual Testing

1. **Test Login:**
   - Go to `/login`
   - Enter credentials
   - Should redirect to `/dashboard`

2. **Test Registration:**
   - Go to `/register`
   - Fill form
   - Should create account and login

3. **Test Protected Routes:**
   - Try accessing `/dashboard` without login
   - Should redirect to `/login`

4. **Test Role-Based Access:**
   - Login as doctor → See doctor dashboard
   - Login as patient → See patient dashboard

---

## 🚀 Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

Build files will be in `dist/` folder.

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build
npm run build

# Drag and drop 'dist' folder to Netlify
```

### Environment Variables

For production, set:
```
VITE_API_URL=https://your-backend-api.com
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"

**Solution:**
- Make sure backend is running on `http://localhost:3000`
- Check backend server is started: `npm run dev`
- Check CORS is enabled in backend

### Issue: "Token expired"

**Solution:**
- Logout and login again
- Token expires after 7 days by default

### Issue: "Page not found"

**Solution:**
- Check route exists in `App.jsx`
- Check you're logged in for protected routes

---

## 📚 Learning Resources

### React
- [React Official Docs](https://react.dev)
- [React Tutorial](https://react.dev/learn)

### Material-UI
- [MUI Documentation](https://mui.com)
- [MUI Components](https://mui.com/components/)

### React Router
- [React Router Docs](https://reactrouter.com)

---

## 🎯 Future Enhancements

- [ ] Video consultations
- [ ] Real-time chat
- [ ] File upload (X-rays, reports)
- [ ] Calendar view for appointments
- [ ] Push notifications
- [ ] Print prescriptions
- [ ] Export medical records (PDF)
- [ ] Dark mode

---

## 📞 Support

If you encounter issues:

1. Check console for errors (F12 → Console)
2. Check backend is running
3. Check API endpoint in `vite.config.js`
4. Clear localStorage: `localStorage.clear()`

---

## 📝 Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Maintenance
npm install          # Install dependencies
npm update           # Update dependencies
```

---

**Built with ❤️ using React + Material-UI**

Frontend: http://localhost:3001
Backend: http://localhost:3000
