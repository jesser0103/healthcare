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
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  MenuItem
} from '@mui/material';
import { Visibility, Search } from '@mui/icons-material';
import { patientsAPI } from '../services/api';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Create Patient State
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    bloodType: ''
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await patientsAPI.getAll();
      setPatients(response.data.data || []);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      try {
        const response = await patientsAPI.search(query);
        setPatients(response.data.data || []);
      } catch (error) {
        console.error('Error searching:', error);
      }
    } else {
      loadPatients();
    }
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleViewPatient = async (patientId) => {
    try {
      setOpenDialog(true);
      setSelectedPatient(null);
      setDetailsLoading(true);
      const response = await patientsAPI.getById(patientId);
      setSelectedPatient(response?.data?.data || null);
    } catch (e) {
      console.error('Error loading patient details:', e);
      setSelectedPatient(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
    setDetailsLoading(false);
  };

  const handleCreatePatient = async () => {
    try {
      setCreateLoading(true);
      await patientsAPI.create(formData);
      setCreateDialogOpen(false);
      setFormData({ firstName: '', lastName: '', dateOfBirth: '', gender: '', email: '', phone: '', bloodType: '' });
      loadPatients();
    } catch (e) {
      console.error('Failed to create patient', e);
      alert('Failed to create patient. Please ensure email is unique and fields are valid.');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Patients
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setCreateDialogOpen(true)}>
            Add Patient
          </Button>
        </Box>
        <TextField
          fullWidth
          placeholder="Search patients by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mt: 2 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Age</strong></TableCell>
              <TableCell><strong>Gender</strong></TableCell>
              <TableCell><strong>Blood Type</strong></TableCell>
              <TableCell><strong>Contact</strong></TableCell>
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
            ) : patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No patients found
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow key={patient._id} hover>
                  <TableCell>
                    {patient.firstName} {patient.lastName}
                  </TableCell>
                  <TableCell>
                    {patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : 'N/A'}
                  </TableCell>
                  <TableCell>{patient.gender || 'N/A'}</TableCell>
                  <TableCell>{patient.bloodType || 'N/A'}</TableCell>
                  <TableCell>
                    {patient.email}
                    <br />
                    <Typography variant="caption" color="textSecondary">
                      {patient.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={patient.status || 'Active'}
                      color={patient.status === 'Active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewPatient(patient._id)}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Patient Details</DialogTitle>
        <DialogContent>
          {detailsLoading ? (
            <Typography sx={{ py: 2 }}>Loading...</Typography>
          ) : !selectedPatient ? (
            <Typography sx={{ py: 2 }} color="textSecondary">
              Unable to load patient details.
            </Typography>
          ) : (
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Name</Typography>
                <Typography>
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Age</Typography>
                <Typography>
                  {selectedPatient.dateOfBirth ? calculateAge(selectedPatient.dateOfBirth) : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Gender</Typography>
                <Typography>{selectedPatient.gender || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Blood Type</Typography>
                <Typography>{selectedPatient.bloodType || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Email</Typography>
                <Typography>{selectedPatient.email || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Phone</Typography>
                <Typography>{selectedPatient.phone || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Address</Typography>
                <Typography color="textSecondary">
                  {selectedPatient.address?.street || ''}
                  {(selectedPatient.address?.city || selectedPatient.address?.state || selectedPatient.address?.zipCode) ? ', ' : ''}
                  {selectedPatient.address?.city || ''}
                  {selectedPatient.address?.state ? `, ${selectedPatient.address.state}` : ''}
                  {selectedPatient.address?.zipCode ? ` ${selectedPatient.address.zipCode}` : ''}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Assigned Doctor</Typography>
                <Typography>
                  {selectedPatient.assignedDoctor
                    ? `Dr. ${selectedPatient.assignedDoctor.firstName} ${selectedPatient.assignedDoctor.lastName} (${selectedPatient.assignedDoctor.specialization})`
                    : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Patient</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="First Name" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Last Name" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Date of Birth" type="date" required InputLabelProps={{ shrink: true }} value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Gender" required value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth select label="Blood Type" value={formData.bloodType} onChange={(e) => setFormData({...formData, bloodType: e.target.value})}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreatePatient} variant="contained" color="primary" disabled={createLoading}>
            {createLoading ? 'Saving...' : 'Save Patient'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
