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
const getAvailableRoomsByType = async (token, roomTypeId, checkInDate, checkOutDate, numberOfGuests) => {
  const params = {
    roomType: roomTypeId,
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
    }
  });

  return response.data;
};

const checkAvailability = async (token, roomType, checkInDate, checkOutDate, numberOfGuests) => {
  try {
    const params = {
      roomType,
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
      }
    });

    return {
      isAvailable: response.data.totalRooms > 0,
      availableRooms: response.data.rooms || [],
      totalRooms: response.data.totalRooms
    };
  } catch (error) {
    return {
      isAvailable: false,
      availableRooms: [],
      totalRooms: 0
    };
  }
};

const roomService = {
  getRoomTypes,
  checkAvailability,
  getAvailableRoomsByType
};

export default roomService;
