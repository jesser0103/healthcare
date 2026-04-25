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
  Event,
  LocalPharmacy,
  Science,
  Receipt
} from '@mui/icons-material';
import { appointmentsAPI, prescriptionsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const { user, patientProfileId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      if (patientProfileId) {
        const [appointmentsRes, prescriptionsRes] = await Promise.all([
          appointmentsAPI.getUpcoming({ patient: patientProfileId }),
          prescriptionsAPI.getByPatient(patientProfileId)
        ]);

        setAppointments(appointmentsRes.data.data || []);
        setPrescriptions(prescriptionsRes.data.data || []);
      }
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
        Welcome, {user?.patientProfile?.firstName || 'Patient'}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Event sx={{ color: 'white' }} />}
            title="Upcoming Appointments"
            value={appointments.length}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<LocalPharmacy sx={{ color: 'white' }} />}
            title="Active Prescriptions"
            value={prescriptions.filter(p => p.status === 'Active').length}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Science sx={{ color: 'white' }} />}
            title="Lab Tests"
            value={0}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Receipt sx={{ color: 'white' }} />}
            title="Pending Invoices"
            value={0}
            color="#d32f2f"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Upcoming Appointments
              </Typography>
              <Button variant="contained" size="small" onClick={() => navigate('/appointments')}>
                Book New
              </Button>
            </Box>
            {appointments.length === 0 ? (
              <Typography color="textSecondary" sx={{ py: 2 }}>
                No upcoming appointments
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
                      primary={`Dr. ${appointment.doctor?.firstName} ${appointment.doctor?.lastName}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.startTime}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            {appointment.reason}
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
              Active Prescriptions
            </Typography>
            {prescriptions.filter(p => p.status === 'Active').length === 0 ? (
              <Typography color="textSecondary" sx={{ py: 2 }}>
                No active prescriptions
              </Typography>
            ) : (
              <List>
                {prescriptions
                  .filter(p => p.status === 'Active')
                  .slice(0, 5)
                  .map((prescription, index) => (
                    <ListItem
                      key={index}
                      divider
                      sx={{
                        '&:hover': { backgroundColor: '#f5f5f5' },
                        cursor: 'pointer'
                      }}
                    >
                      <ListItemText
                        primary={prescription.prescriptionNumber}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              Dr. {prescription.doctor?.firstName} {prescription.doctor?.lastName}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2">
                              {prescription.medications?.length || 0} medication(s)
                            </Typography>
                            <br />
                            <Chip
                              label={prescription.status}
                              size="small"
                              color="success"
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
      </Grid>
    </Container>
  );
}
