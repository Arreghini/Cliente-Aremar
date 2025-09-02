import React, { useEffect, useState } from 'react';
import roomService from '../../services/RoomService';
import PropTypes from 'prop-types';

const RoomList = ({ checkInDate, checkOutDate }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (!checkInDate || !checkOutDate) {
        return;
      }

      // Simular delay para mostrar loading spinner
     await (!import.meta.env.VITE_TEST
  ? new Promise((resolve) => setTimeout(resolve, 2000))
  : Promise.resolve());

      try {
        const data = await roomService.getAvailableRooms(
          checkInDate,
          checkOutDate
        );
        setRooms(data);
      } catch (error) {
        console.error('Error fetching available rooms:', error);
      }
    };
    fetchAvailableRooms();
  }, [checkInDate, checkOutDate]);

  return (
    <div>
      <h1>Disponibilidad de habitaciones</h1>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.description}
            {/* Más detalles de la habitación */}
          </li>
        ))}
      </ul>
    </div>
  );
};
RoomList.propTypes = {
  checkInDate: PropTypes.string.isRequired,
  checkOutDate: PropTypes.string.isRequired,
};

export default RoomList;
