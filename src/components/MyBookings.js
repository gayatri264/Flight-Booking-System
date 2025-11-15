import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [edit, setEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/bookings`);
      const data = await res.json();
      setBookings(data);
      setError('');
    } catch {
      setError('Failed to load bookings');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    await fetch(`${API}/api/bookings/${id}`, { method: 'DELETE' });
    await load();
  };

  const handleSave = async () => {
    await fetch(`${API}/api/bookings/${edit._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edit)
    });
    setEdit(null);
    await load();
  };

  return (
    <div>
      <h2>My Bookings</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {bookings.length === 0 && !loading && <p>No bookings yet.</p>}
      {bookings.map(b => (
        <div
          key={b._id}
          style={{
            border: '1px solid #ddd',
            padding: 12,
            margin: '12px 0',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16
          }}
        >
          {edit && edit._id === b._id ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, flex: 1 }}>
              <input value={edit.passengerName||''} onChange={e=>setEdit({...edit, passengerName:e.target.value})} placeholder="Passenger Name" />
              <input value={edit.contact||''} onChange={e=>setEdit({...edit, contact:e.target.value})} placeholder="Contact" />
              <input value={edit.flightNumber||''} onChange={e=>setEdit({...edit, flightNumber:e.target.value})} placeholder="Flight Number" />
              <input value={edit.destination||''} onChange={e=>setEdit({...edit, destination:e.target.value})} placeholder="Destination" />
              <input value={edit.seatClass||''} onChange={e=>setEdit({...edit, seatClass:e.target.value})} placeholder="Seat Class" />
              <input type="number" value={edit.passengers||1} onChange={e=>setEdit({...edit, passengers:Number(e.target.value)})} placeholder="Passengers" />
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={handleSave}>Save</button>
                <button onClick={()=>setEdit(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ flex: 1, display:'flex', flexDirection:'row', gap:20 }}>
                <span><b>{b.passengerName}</b></span>
                <span>Flight: {b.flightNumber} → {b.destination}</span>
                <span>Class: {b.seatClass}</span>
                <span>Pax: {b.passengers}</span>
                <span>Total: INR {b.totalPrice}</span>
              </div>
              <div>
                <IconButton onClick={()=>setEdit(b)} size="small" color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={()=>handleDelete(b._id)} size="small" color="error">
                  <DeleteIcon />
                </IconButton>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
