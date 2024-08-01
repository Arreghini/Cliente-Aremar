import React, { useState } from 'react';
import RoomList from '../components/RoomList';

const RoomListPage = () => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  const handleSearch = () => {
    // Trigger RoomList to fetch available rooms with selected dates
  };

  return (
    <div>
      <h1>Search for Available Rooms</h1>
      <input
        type="date"
        value={checkInDate}
        onChange={(e) => setCheckInDate(e.target.value)}
      />
      <input
        type="date"
        value={checkOutDate}
        onChange={(e) => setCheckOutDate(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <RoomList checkInDate={checkInDate} checkOutDate={checkOutDate} />
    </div>
  );
};

export default RoomListPage;
