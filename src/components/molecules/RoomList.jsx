import React, { useEffect, useState } from 'react';
import roomService from '../../services/roomService';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/rooms';

const RoomList = ({ checkInDate, checkOutDate }) => {
  const [rooms, setRooms] = useState([]);
 
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (!checkInDate || !checkOutDate) {
        return;
      }
      
      // Simular delay para mostrar loading spinner
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Realizar la llamada a la API para obtener las habitaciones disponibles
     const response = await axios.get(`${BASE_URL}/all`, {
       params: {
         checkInDate,
         checkOutDate,
       }
    });  
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
      <h1>Disponibilidad de habitaciones</h1>
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
