import React, { useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Box, Typography } from '@mui/material';
import sampleFlights from '../data/sampleFlights.json';

export default function FlightList({ onSelectFlight }){
  const [query, setQuery] = useState('');

  const filtered = sampleFlights.filter(f =>
    f.flightNumber.toLowerCase().includes(query.toLowerCase()) ||
    f.destination.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <TextField
        fullWidth
        label="Search by Flight Number or Destination (shows all flights)"
        value={query}
        onChange={(e)=>setQuery(e.target.value)}
        sx={{ mb:2 }}
      />
      <Typography variant="body2" sx={{ mb:1 }}>Click a row to select a flight for booking.</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Flight No.</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Departure</TableCell>
              <TableCell>Base Price (INR)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(f => (
              <TableRow key={f.flightNumber} hover onClick={()=>onSelectFlight && onSelectFlight(f)} sx={{ cursor:'pointer' }}>
                <TableCell>{f.flightNumber}</TableCell>
                <TableCell>{f.destination}</TableCell>
                <TableCell>{f.departureTime}</TableCell>
                <TableCell>{f.price}</TableCell>
              </TableRow>
            ))}
            {filtered.length===0 && (
              <TableRow><TableCell colSpan={4} align="center">No flights found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
