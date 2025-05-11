import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/rooms';

const getRoomTypes = async (token) => {
    if (!token) {
      throw new Error('Token no proporcionado');
    }
  try {
    const response = await axios.get(`${BASE_URL}/roomType`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener tipos de habitación:', error);
    throw error;
  }
};
const getRoomTypeById = async (token, roomId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${roomId}`, {

      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener tipo de habitación por ID:', error);
    throw error;
  }
};
const getAvailableRoomsByType = async (token, roomTypeId, checkInDate, checkOutDate, numberOfGuests) => {
  const params = {
    roomType: roomTypeId,
    checkInDate: new Date(checkInDate).toISOString().split('T')[0],
    checkOutDate: new Date(checkOutDate).toISOString().split('T')[0],
    numberOfGuests: parseInt(numberOfGuests, 10)
  };

  console.log("Parámetros de búsqueda:", params);

  const response = await axios({
    method: 'get',
    url: `${BASE_URL}/available`,
    params,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });

  console.log("Respuesta del servidor:", response.data);
  return response.data;
};

const checkAvailability = async (token, reservationId, roomType, checkInDate, checkOutDate, numberOfGuests) => {
  try {
    const params = {
      reservationId,
      roomType,
      checkInDate: new Date(checkInDate).toISOString().split('T')[0],
      checkOutDate: new Date(checkOutDate).toISOString().split('T')[0],
      numberOfGuests: parseInt(numberOfGuests, 10),
    };
    console.log("Parámetros de búsqueda:", params);

    const response = await axios({
      method: 'get',
      url: `${BASE_URL}/available`,
      params,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    console.log("Respuesta del servidor:", response.data);
    return {
      isAvailable: response.data.totalRooms > 0,
      availableRooms: response.data.rooms || [],
      totalRooms: response.data.totalRooms,
    };
  } catch (error) {
    console.error("Error al verificar disponibilidad:", error);
    return {
      isAvailable: false,
      availableRooms: [],
      totalRooms: 0,
    };
  }
};

const roomService = {
  getRoomTypes,
  getRoomTypeById,
  checkAvailability,
  getAvailableRoomsByType,
};

export default roomService;
