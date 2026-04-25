import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Layout from './components/Layout';
import Patients from './pages/Patients';
import Prescriptions from './pages/Prescriptions';
import Appointments from './pages/Appointments';
import LabTests from './pages/LabTests';
import Invoices from './pages/Invoices';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const { isAuthenticated, isDoctor, isPatient } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
          } />
          
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={
              isDoctor ? <DoctorDashboard /> : <PatientDashboard />
            } />
            <Route path="patients" element={<Patients />} />
            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="lab-tests" element={<LabTests />} />
            <Route path="lab-results" element={<LabTests />} />
            <Route path="invoices" element={<Invoices />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
