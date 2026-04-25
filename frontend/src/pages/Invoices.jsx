import React, { useEffect, useState } from 'react';
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
  Chip
} from '@mui/material';
import { invoicesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Invoices() {
  const { patientProfileId } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, [patientProfileId]);

  const loadInvoices = async () => {
    try {
      if (!patientProfileId) {
        setInvoices([]);
        return;
      }

      const response = await invoicesAPI.getAll({ patient: patientProfileId });
      setInvoices(response?.data?.data || []);
    } catch (e) {
      console.error('Error loading invoices:', e);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const formatMoney = (amount) => {
    if (amount === null || amount === undefined) return 'N/A';
    const number = Number(amount);
    if (Number.isNaN(number)) return String(amount);
    return number.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Invoices
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Invoice #</strong></TableCell>
              <TableCell><strong>Invoice Date</strong></TableCell>
              <TableCell><strong>Due Date</strong></TableCell>
              <TableCell><strong>Total</strong></TableCell>
              <TableCell><strong>Paid</strong></TableCell>
              <TableCell><strong>Balance</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No invoices found
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => (
                <TableRow key={inv._id} hover>
                  <TableCell>{inv.invoiceNumber}</TableCell>
                  <TableCell>{formatDate(inv.invoiceDate)}</TableCell>
                  <TableCell>{formatDate(inv.dueDate)}</TableCell>
                  <TableCell>{formatMoney(inv.grandTotal)}</TableCell>
                  <TableCell>{formatMoney(inv.paidAmount)}</TableCell>
                  <TableCell>{formatMoney(inv.balance)}</TableCell>
                  <TableCell>
                    <Chip
                      label={inv.paymentStatus || inv.status}
                      size="small"
                      color={
                        inv.paymentStatus === 'Paid' ? 'success' :
                        inv.paymentStatus === 'Overdue' ? 'warning' :
                        'default'
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
