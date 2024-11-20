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
    const cleanRoomType = roomType.trim();
    
    // Validamos y formateamos los datos antes de enviar
    const params = {
      roomType: cleanRoomType,
      checkInDate: new Date(checkInDate).toISOString().split('T')[0],
      checkOutDate: new Date(checkOutDate).toISOString().split('T')[0],
      numberOfGuests: parseInt(numberOfGuests, 10)
    };

    const response = await axios({
      method: 'get',
      url: `${BASE_URL}/available`,
      params,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      validateStatus: status => status < 500
    });

    console.log('Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('Detalles de la petición:', {
      url: error.config?.url,
      params: error.config?.params,
      response: error.response?.data
    });
    throw new Error('Error al verificar disponibilidad de habitación');
  }
};

const roomService = {
  getRoomTypes,
  checkAvailability,
};

export default roomService;
