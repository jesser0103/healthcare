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
import { labTestsAPI, patientsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

export default function LabTests() {
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isDoctor, isPatient, patientProfileId, doctorProfileId } = useAuth();
  const location = useLocation();

  const isLabResultsView = location.pathname.includes('/lab-results');

  const [formData, setFormData] = useState({
    patient: '',
    testName: '',
    testType: 'Blood Test',
    scheduledDate: '',
    priority: 'Routine',
    instructions: ''
  });

  useEffect(() => {
    loadLabTests();
    if (isDoctor && !isLabResultsView) {
      loadPatients();
    }
  }, [isDoctor, isPatient, patientProfileId, doctorProfileId, isLabResultsView]);

  const loadLabTests = async () => {
    try {
      const params = {};

      // In lab-results view, always show patient's lab tests
      if (isLabResultsView && patientProfileId) {
        params.patient = patientProfileId;
      } else {
        // For doctor view, scope to doctor (keeps list relevant)
        if (isDoctor && doctorProfileId) {
          params.doctor = doctorProfileId;
        }
        // For patient navigating to /lab-tests directly, still scope
        if (isPatient && patientProfileId) {
          params.patient = patientProfileId;
        }
      }

      const response = await labTestsAPI.getAll(Object.keys(params).length ? params : undefined);
      setLabTests(response?.data?.data || []);
    } catch (e) {
      console.error('Error loading lab tests:', e);
      setLabTests([]);
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
      testName: '',
      testType: 'Blood Test',
      scheduledDate: '',
      priority: 'Routine',
      instructions: ''
    });
  };

  const handleSubmit = async () => {
    try {
      setError('');

      if (!doctorProfileId) {
        setError('Doctor profile not found for current user');
        return;
      }

      if (!formData.patient || !formData.testName) {
        setError('Please fill in all required fields');
        return;
      }

      const payload = {
        patient: formData.patient,
        doctor: doctorProfileId,
        testName: formData.testName,
        testType: formData.testType,
        scheduledDate: formData.scheduledDate || undefined,
        priority: formData.priority,
        instructions: formData.instructions
      };

      await labTestsAPI.create(payload);
      setSuccess('Lab test order created successfully!');

      setTimeout(() => {
        handleCloseDialog();
        setLoading(true);
        loadLabTests();
      }, 1200);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create lab test');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {isLabResultsView ? 'Lab Results' : 'Lab Tests'}
        </Typography>
        {isDoctor && !isLabResultsView && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenDialog}
          >
            Order Lab Test
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Test Number</strong></TableCell>
              <TableCell><strong>Patient</strong></TableCell>
              <TableCell><strong>Test Name</strong></TableCell>
              <TableCell><strong>Test Type</strong></TableCell>
              <TableCell><strong>Date Ordered</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="textSecondary">Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : labTests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="textSecondary">
                    No lab tests found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              labTests.map((test) => (
                <TableRow key={test._id} hover>
                  <TableCell>{test.testNumber}</TableCell>
                  <TableCell>
                    {test.patient?.firstName} {test.patient?.lastName}
                  </TableCell>
                  <TableCell>{test.testName}</TableCell>
                  <TableCell>{test.testType}</TableCell>
                  <TableCell>
                    {new Date(test.orderedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={test.status}
                      color={
                        test.status === 'Completed' ? 'success' :
                        test.status === 'In Progress' ? 'info' :
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

      {/* Order Lab Test Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Order Lab Test</DialogTitle>
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
                required
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
              <TextField
                fullWidth
                label="Test Name"
                value={formData.testName}
                onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                placeholder="e.g., Complete Blood Count"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Test Type"
                value={formData.testType}
                onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
              >
                <MenuItem value="Blood Test">Blood Test</MenuItem>
                <MenuItem value="Urine Test">Urine Test</MenuItem>
                <MenuItem value="X-Ray">X-Ray</MenuItem>
                <MenuItem value="MRI">MRI</MenuItem>
                <MenuItem value="CT Scan">CT Scan</MenuItem>
                <MenuItem value="Ultrasound">Ultrasound</MenuItem>
                <MenuItem value="ECG">ECG</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <MenuItem value="Routine">Routine</MenuItem>
                <MenuItem value="Urgent">Urgent</MenuItem>
                <MenuItem value="Emergency">Emergency</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Scheduled Date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Instructions"
                multiline
                rows={3}
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="Any special instructions or preparations needed..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={success}>
            Order Test
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
