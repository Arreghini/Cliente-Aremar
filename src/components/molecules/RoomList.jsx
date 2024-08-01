import React, { useEffect, useState } from 'react';
import roomService from '../services/roomService';

const RoomList = ({ checkInDate, checkOutDate }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const data = await roomService.getAvailableRooms(checkInDate, checkOutDate);
        setRooms(data);
      } catch (error) {
        console.error('Error fetching available rooms:', error);
      }
    };

    fetchAvailableRooms();
  }, [checkInDate, checkOutDate]);

  return (
    <div>
      <h1>Available Rooms</h1>
      <ul>
        {rooms.map(room => (
          <li key={room.id}>
            {room.description}
            {/* Más detalles de la habitación */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
