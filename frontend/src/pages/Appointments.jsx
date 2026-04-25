import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  MenuItem
} from '@mui/material';
import { Visibility, Add } from '@mui/icons-material';
import { appointmentsAPI, patientsAPI, doctorsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, isDoctor, isPatient, patientProfileId, doctorProfileId } = useAuth();

  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    appointmentDate: '',
    startTime: '',
    endTime: '',
    appointmentType: 'Consultation',
    reason: ''
  });

  useEffect(() => {
    loadAppointments();
  }, [user, isDoctor, isPatient]);

  const loadAppointments = async () => {
    try {
      const params = {};
      if (isDoctor && doctorProfileId) {
        params.doctor = doctorProfileId;
      }
      if (isPatient && patientProfileId) {
        params.patient = patientProfileId;
      }

      const response = await appointmentsAPI.getAll(Object.keys(params).length ? params : undefined);
      setAppointments(response?.data?.data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async () => {
    try {
      const response = await patientsAPI.getAll();
      setPatients(response?.data?.data || []);
    } catch (e) {
      console.error('Error loading patients:', e);
    }
  };

  const loadDoctors = async () => {
    try {
      const response = await doctorsAPI.getAll();
      setDoctors(response?.data?.data || []);
    } catch (e) {
      console.error('Error loading doctors:', e);
    }
  };

  const handleOpenDialog = async () => {
    setOpenDialog(true);
    setError('');
    setSuccess('');

    if (isDoctor) {
      await loadPatients();
      setFormData((prev) => ({
        ...prev,
        doctor: doctorProfileId || '',
        patient: ''
      }));
    } else if (isPatient) {
      await loadDoctors();
      setFormData((prev) => ({
        ...prev,
        patient: patientProfileId || '',
        doctor: ''
      }));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      patient: isPatient ? (patientProfileId || '') : '',
      doctor: isDoctor ? (doctorProfileId || '') : '',
      appointmentDate: '',
      startTime: '',
      endTime: '',
      appointmentType: 'Consultation',
      reason: ''
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setSuccess('');

      const payload = {
        patient: isPatient ? (patientProfileId || formData.patient) : formData.patient,
        doctor: isDoctor ? (doctorProfileId || formData.doctor) : formData.doctor,
        appointmentDate: formData.appointmentDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        appointmentType: formData.appointmentType,
        reason: formData.reason
      };

      if (!payload.patient) return setError('Please select a patient');
      if (!payload.doctor) return setError('Please select a doctor');
      if (!payload.appointmentDate) return setError('Please select a date');
      if (!payload.startTime || !payload.endTime) return setError('Please enter start and end time');
      if (!payload.reason) return setError('Please enter a reason');

      await appointmentsAPI.create(payload);
      setSuccess('Appointment created successfully!');

      setTimeout(() => {
        handleCloseDialog();
        setLoading(true);
        loadAppointments();
      }, 1200);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create appointment');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Appointments
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          New Appointment
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Patient</strong></TableCell>
              <TableCell><strong>Doctor</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Time</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No appointments found
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment._id} hover>
                  <TableCell>
                    {appointment.patient?.firstName} {appointment.patient?.lastName}
                  </TableCell>
                  <TableCell>
                    Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                  </TableCell>
                  <TableCell>{formatDate(appointment.appointmentDate)}</TableCell>
                  <TableCell>{appointment.startTime}</TableCell>
                  <TableCell>{appointment.appointmentType}</TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status}
                      color={
                        appointment.status === 'Confirmed' ? 'success' :
                        appointment.status === 'Scheduled' ? 'info' :
                        appointment.status === 'Completed' ? 'default' :
                        'warning'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary">
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Appointment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>New Appointment</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            {isDoctor && (
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Patient"
                  value={formData.patient}
                  onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                  SelectProps={{ native: true }}
                  required
                  disabled={!!success}
                >
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.firstName} {p.lastName}
                    </option>
                  ))}
                </TextField>
              </Grid>
            )}

            {isPatient && (
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Doctor"
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                  disabled={!!success}
                  required
                >
                  <MenuItem value="">Select Doctor</MenuItem>
                  {doctors.map((d) => (
                    <MenuItem key={d._id} value={d._id}>
                      Dr. {d.firstName} {d.lastName} ({d.specialization})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                disabled={!!success}
                required
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Start"
                placeholder="09:00"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                disabled={!!success}
                required
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="End"
                placeholder="09:30"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                disabled={!!success}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Appointment Type"
                value={formData.appointmentType}
                onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                disabled={!!success}
              >
                <MenuItem value="Consultation">Consultation</MenuItem>
                <MenuItem value="Follow-up">Follow-up</MenuItem>
                <MenuItem value="Emergency">Emergency</MenuItem>
                <MenuItem value="Routine Checkup">Routine Checkup</MenuItem>
                <MenuItem value="Surgery">Surgery</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                disabled={!!success}
                required
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!!success}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
