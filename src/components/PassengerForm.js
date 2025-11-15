import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, MenuItem, RadioGroup, FormControlLabel, Radio, IconButton, Stack, Paper } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import Button from '@mui/material/Button'; // at the top with other imports


// Pricing multipliers relative to base price
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const CLASS_MULTIPLIERS = {
  'First Class': 1.70,
  'Business': 1.50,
  'Premium Economy': 1.30,
  'Economy': 1.00
};

export default function PassengerForm({ flight }){
  const [form, setForm] = useState({
    name: '', dob: '', gender: 'Male', seatClass: 'Economy', contact: ''
  });
  const [passengers, setPassengers] = useState(1);
  const [selectedFlight, setSelectedFlight] = useState(flight || null);
  const [pricePerPassenger, setPricePerPassenger] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(()=>{
    setSelectedFlight(flight || null);
  }, [flight]);

  useEffect(()=>{
    // compute price based on selected flight and class multiplier
    const base = selectedFlight ? Number(selectedFlight.price) : 0;
    const mult = CLASS_MULTIPLIERS[form.seatClass] || 1.0;
    const per = Math.round(base * mult);
    setPricePerPassenger(per);
    setTotalPrice(per * passengers);
  }, [selectedFlight, form.seatClass, passengers]);

  const handleChange = (e) => setForm(prev=>({...prev, [e.target.name]: e.target.value}));

  const inc = ()=> setPassengers(p=>Math.min(10, p+1));
  const dec = ()=> setPassengers(p=>Math.max(1, p-1));

  const flightInfo = selectedFlight ? selectedFlight : null;


  const handleBookNow = async () => {
    if (!selectedFlight) { alert('Please select a flight first from "Search Flights"'); return; }
    const payload = {
      passengerName: form.name,
      contact: form.contact,
      gender: form.gender,
      seatClass: form.seatClass,
      passengers,
      flightNumber: selectedFlight.flightNumber || selectedFlight.flightNo,
      destination: selectedFlight.destination,
      departureTime: selectedFlight.departureTime || selectedFlight.departure,
      pricePerPassenger,
      totalPrice
    };
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok){
        alert('Booking saved! Check My Bookings tab.');
      } else {
        const e = await res.json().catch(()=>({error:'Unknown error'}));
        alert('Failed to save: ' + (e.error || res.status));
      }
    } catch (e){
      alert('Failed to reach server');
    }
  };

  return (
    <Box sx={{ display:'grid', gap:2 }}>
      <Paper sx={{ p:2 }}>
        <Typography variant="h6">Selected Flight</Typography>
        {flightInfo ? (
          <Box>
            <Typography>Flight: {flightInfo.flightNumber} — {flightInfo.destination}</Typography>
            <Typography>Departure: {flightInfo.departureTime}</Typography>
            <Typography>Base Price: INR {flightInfo.price}</Typography>
          </Box>
        ) : (
          <Typography color="text.secondary">No flight selected. Go to "Search Flights" tab and click a flight.</Typography>
        )}
      </Paper>

      <Box component="form" sx={{ display:'grid', gap:2 }}>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} required />
        <TextField label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} InputLabelProps={{ shrink: true }}  required/>

        <Typography>Gender< required /></Typography>
        <RadioGroup row name="gender" value={form.gender} onChange={handleChange}>
          <FormControlLabel value="Male" control={<Radio />} label="Male" />
          <FormControlLabel value="Female" control={<Radio />} label="Female" />
          <FormControlLabel value="Other" control={<Radio />} label="Other" />
        </RadioGroup>

        <Typography>Seat Class< required /></Typography>
        <RadioGroup row name="seatClass" value={form.seatClass} onChange={handleChange} >
          {Object.keys(CLASS_MULTIPLIERS).map(c=>(
            <FormControlLabel key={c} value={c} control={<Radio />} label={c} />
          ))}
        </RadioGroup>

        <TextField label="Contact" name="contact" value={form.contact} onChange={handleChange} required />

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>Passengers< required /></Typography>
          <IconButton onClick={dec}><Remove /></IconButton>
          <Typography>{passengers}</Typography>
          <IconButton onClick={inc}><Add /></IconButton>
        </Stack>

        <Paper sx={{ p:2 }}>
          <Typography variant="subtitle1">Price Details</Typography>
          <Typography>Price per passenger ({form.seatClass}): INR {pricePerPassenger}</Typography>
          <Typography>Number of passengers: {passengers}</Typography>
          <Typography variant="h6">Total: INR {totalPrice}</Typography>
        </Paper>
      </Box>

      <Paper sx={{ p:2 }}>
        <Typography variant="h6">Live Preview</Typography>
        <Typography>Name: {form.name}</Typography>
        <Typography>DOB: {form.dob}</Typography>
        <Typography>Gender: {form.gender}</Typography>
        <Typography>Seat Class: {form.seatClass}</Typography>
        <Typography>Contact: {form.contact}</Typography>
        <Typography>Passengers: {passengers}</Typography>
        <Typography>Total Fare: INR {totalPrice}</Typography>
      </Paper>
        <Button 
  variant="contained" 
  color="primary" 
  onClick={handleBookNow}
  sx={{ mt: 2, height: 36, minWidth: 120, textTransform: 'none' }}
   >
  Book Now
</Button>

    </Box>
  );
}
