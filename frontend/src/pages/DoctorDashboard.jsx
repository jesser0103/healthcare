import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip
} from '@mui/material';
import {
  People,
  EventNote,
  LocalPharmacy,
  Science
} from '@mui/icons-material';
import { appointmentsAPI, patientsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    prescriptions: 0,
    labTests: 0
  });
  const { user, doctorProfileId } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const apptParams = doctorProfileId ? { doctor: doctorProfileId } : undefined;
      const [appointmentsRes, patientsRes] = await Promise.all([
        appointmentsAPI.getUpcoming(apptParams),
        patientsAPI.getAll()
      ]);

      setAppointments(appointmentsRes.data.data || []);
      setPatients(patientsRes.data.data || []);

      setStats({
        totalPatients: patientsRes.data.count || 0,
        todayAppointments: appointmentsRes.data.count || 0,
        prescriptions: 0,
        labTests: 0
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const StatCard = ({ icon, title, value, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: '50%',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, Dr. {user?.doctorProfile?.firstName || 'Doctor'}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<People sx={{ color: 'white' }} />}
            title="Total Patients"
            value={stats.totalPatients}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<EventNote sx={{ color: 'white' }} />}
            title="Today's Appointments"
            value={stats.todayAppointments}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<LocalPharmacy sx={{ color: 'white' }} />}
            title="Prescriptions"
            value={stats.prescriptions}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Science sx={{ color: 'white' }} />}
            title="Lab Tests"
            value={stats.labTests}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Today's Appointments
            </Typography>
            {appointments.length === 0 ? (
              <Typography color="textSecondary" sx={{ py: 2 }}>
                No appointments scheduled for today
              </Typography>
            ) : (
              <List>
                {appointments.slice(0, 5).map((appointment, index) => (
                  <ListItem
                    key={index}
                    divider
                    sx={{
                      '&:hover': { backgroundColor: '#f5f5f5' },
                      cursor: 'pointer'
                    }}
                  >
                    <ListItemText
                      primary={`${appointment.patient?.firstName} ${appointment.patient?.lastName}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            {appointment.startTime} - {appointment.reason}
                          </Typography>
                          <br />
                          <Chip
                            label={appointment.status}
                            size="small"
                            color={
                              appointment.status === 'Confirmed' ? 'success' : 'default'
                            }
                            sx={{ mt: 0.5 }}
                          />
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Patients
            </Typography>
            {patients.length === 0 ? (
              <Typography color="textSecondary" sx={{ py: 2 }}>
                No patients registered yet
              </Typography>
            ) : (
              <List>
                {patients.slice(0, 5).map((patient, index) => (
                  <ListItem
                    key={index}
                    divider
                    sx={{
                      '&:hover': { backgroundColor: '#f5f5f5' },
                      cursor: 'pointer'
                    }}
                  >
                    <ListItemText
                      primary={`${patient.firstName} ${patient.lastName}`}
                      secondary={
                        <>
                          {patient.email}
                          <br />
                          {patient.phone}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
