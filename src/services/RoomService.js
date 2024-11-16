import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/rooms';

// const getAvailableRooms = async (token, roomType, checkInDate, checkOutDate) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/all`, {
//       params: {
//         roomType,       
//         checkInDate,
//         checkOutDate,
//         status: 'available',
//       },
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error al obtener habitaciones disponibles:', error);
//     throw error;
//   }
// };

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
    
    return response.data.available;
  } catch (error) {
    console.error('Detalles de la petición:', {
      roomType,
      checkInDate,
      checkOutDate,
      numberOfGuests
    });
    throw new Error('Error al verificar disponibilidad');
  }
};

const roomService = {
 // getAvailableRooms,
  getRoomTypes,
  checkAvailability,
};

export default roomService;
