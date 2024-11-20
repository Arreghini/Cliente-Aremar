import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/rooms';

const getRoomTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/roomType`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener tipos de habitación:', error);
    throw error;
  }
};
const checkAvailability = async (token, roomType, checkInDate, checkOutDate, numberOfGuests) => {
  try {
    const response = await axios.get(`${BASE_URL}/available`, {
      params: {
        roomType,
        checkInDate,
        checkOutDate,
        numberOfGuests: parseInt(numberOfGuests)
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Respuesta completa del servidor:', response.data);
    // Si el backend encuentra habitaciones, consideramos que hay disponibilidad
    return true;
  } catch (error) {
    console.error('Error en checkAvailability:', error);
    return false;
  }
};


const roomService = {
 // getAvailableRooms,
  getRoomTypes,
  checkAvailability,
};

export default roomService;
