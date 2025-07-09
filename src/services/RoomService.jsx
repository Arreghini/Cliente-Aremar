import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/rooms';

const getRoomTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/roomType`,
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener tipos de habitación:', error);
    throw error;
  }
};
const getRoomTypeById = async (roomId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${roomId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener tipo de habitación por ID:', error);
    throw error;
  }
};
const getAvailableRoomsByType = async (token, roomTypeId, checkIn, checkOut, numberOfGuests) => {
  console.log("Parámetros de búsqueda:", { roomTypeId, checkIn, checkOut, numberOfGuests });

  const response = await axios.get(
    `${BASE_URL}/available`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        roomTypeId,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        numberOfGuests,
      },
    }
  );

  return response.data;
};

const checkAvailability = async (reservationId, roomTypeId, checkIn, checkOut, numberOfGuests) => {
  try {
    const params = {
      roomTypeId,
      checkIn,
      checkOut,
      numberOfGuests,
    };
    if (reservationId) {
      params.reservationId = reservationId;
    }
    // Validar los parámetros antes de enviarlos
    if (!params.roomTypeId || !params.checkIn || !params.checkOut || isNaN(params.numberOfGuests)) {
      throw new Error('Parámetros inválidos para la búsqueda de disponibilidad.');
    }

    console.log("Parámetros de búsqueda:", params);

    const response = await axios({
      method: 'get',
      url: `${BASE_URL}/available`,
      params,
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
