import React, { useState } from 'react';
import { Container, CssBaseline, Typography, AppBar, Toolbar, Tabs, Tab, Box } from '@mui/material';
import FlightList from './components/FlightList';
import PassengerForm from './components/PassengerForm';
import MyBookings from './components/MyBookings';

export default function App(){
  const [tab, setTab] = useState(0);
  const [selectedFlight, setSelectedFlight] = useState(null);

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Flight Booking System</Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Tabs value={tab} onChange={(e,v)=>setTab(v)} sx={{ mb:2 }}>
          <Tab label="Search Flights" />
          <Tab label="Passenger Details" />
          <Tab label="My Bookings" />
        </Tabs>
        <Box hidden={tab!==0}>
          <FlightList onSelectFlight={(f)=>{ setSelectedFlight(f); setTab(1); }} />
        </Box>
        <Box hidden={tab!==1}>
          <PassengerForm flight={selectedFlight} />
        </Box>
        <Box hidden={tab!==2}>
          <MyBookings />
        </Box>
      </Container>
    </>
  );
}
