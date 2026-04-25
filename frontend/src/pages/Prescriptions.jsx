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
  Alert
} from '@mui/material';
import { Visibility, Add } from '@mui/icons-material';
import { prescriptionsAPI, patientsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, isDoctor, isPatient, patientProfileId, doctorProfileId } = useAuth();
  
  const [formData, setFormData] = useState({
    patient: '',
    medications: [{
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    }],
    diagnosis: '',
    notes: ''
  });

  useEffect(() => {
    loadPrescriptions();
    if (isDoctor) {
      loadPatients();
    }
  }, []);

  const loadPrescriptions = async () => {
    try {
      let response;
      if (isDoctor) {
        response = await prescriptionsAPI.getAll();
      } else if (isPatient && patientProfileId) {
        response = await prescriptionsAPI.getByPatient(patientProfileId);
      }
      setPrescriptions(response?.data?.data || []);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async () => {
    try {
      const response = await patientsAPI.getAll();
      setPatients(response?.data?.data || []);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setError('');
    setSuccess('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      patient: '',
      medications: [{
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      }],
      diagnosis: '',
      notes: ''
    });
  };

  const handleSubmit = async () => {
    try {
      setError('');
      
      if (!formData.patient) {
        setError('Please select a patient');
        return;
      }
      
      if (!formData.medications[0].name) {
        setError('Please add at least one medication');
        return;
      }

      const prescriptionData = {
        patient: formData.patient,
        doctor: doctorProfileId,
        medications: formData.medications,
        diagnosis: formData.diagnosis,
        notes: formData.notes
      };

      await prescriptionsAPI.create(prescriptionData);
      setSuccess('Prescription created successfully!');
      
      setTimeout(() => {
        handleCloseDialog();
        loadPrescriptions();
      }, 1500);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create prescription');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Prescriptions
        </Typography>
        {isDoctor && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenDialog}
          >
            New Prescription
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Prescription #</strong></TableCell>
              <TableCell><strong>Patient</strong></TableCell>
              {isDoctor && <TableCell><strong>Doctor</strong></TableCell>}
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Medications</strong></TableCell>
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
            ) : prescriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No prescriptions found
                </TableCell>
              </TableRow>
            ) : (
              prescriptions.map((prescription) => (
                <TableRow key={prescription._id} hover>
                  <TableCell>{prescription.prescriptionNumber}</TableCell>
                  <TableCell>
                    {prescription.patient?.firstName} {prescription.patient?.lastName}
                  </TableCell>
                  {isDoctor && (
                    <TableCell>
                      Dr. {prescription.doctor?.firstName} {prescription.doctor?.lastName}
                    </TableCell>
                  )}
                  <TableCell>{formatDate(prescription.prescriptionDate)}</TableCell>
                  <TableCell>
                    {prescription.medications?.length || 0} medication(s)
                    {prescription.medications && prescription.medications.length > 0 && (
                      <Typography variant="caption" display="block" color="textSecondary">
                        {prescription.medications[0].name}
                        {prescription.medications.length > 1 && ` +${prescription.medications.length - 1} more`}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={prescription.status}
                      color={
                        prescription.status === 'Active' ? 'success' :
                        prescription.status === 'Completed' ? 'info' :
                        'default'
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

      {/* Create Prescription Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create New Prescription</DialogTitle>
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
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Patient"
                value={formData.patient}
                onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                SelectProps={{ native: true }}
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Medication
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Medication Name"
                value={formData.medications[0].name}
                onChange={(e) => setFormData({
                  ...formData,
                  medications: [{
                    ...formData.medications[0],
                    name: e.target.value
                  }]
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dosage (e.g., 10mg)"
                value={formData.medications[0].dosage}
                onChange={(e) => setFormData({
                  ...formData,
                  medications: [{
                    ...formData.medications[0],
                    dosage: e.target.value
                  }]
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Frequency (e.g., Twice daily)"
                value={formData.medications[0].frequency}
                onChange={(e) => setFormData({
                  ...formData,
                  medications: [{
                    ...formData.medications[0],
                    frequency: e.target.value
                  }]
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (e.g., 7 days)"
                value={formData.medications[0].duration}
                onChange={(e) => setFormData({
                  ...formData,
                  medications: [{
                    ...formData.medications[0],
                    duration: e.target.value
                  }]
                })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Instructions"
                multiline
                rows={2}
                value={formData.medications[0].instructions}
                onChange={(e) => setFormData({
                  ...formData,
                  medications: [{
                    ...formData.medications[0],
                    instructions: e.target.value
                  }]
                })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Diagnosis"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={success}>
            Create Prescription
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
