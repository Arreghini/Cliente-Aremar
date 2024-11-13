import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/rooms';

const getAvailableRooms = async (roomType, checkInDate, checkOutDate) => {

  const response = await axios.get(`${BASE_URL}/all`, {
    params: {
      roomType,
      checkInDate,
      checkOutDate,
      status: 'available',
    },
  });
  return response.data;
};

const getRoomTypes = async () => {
  const response = await axios.get(`${BASE_URL}/admin/roomType`);
  return response.data; 
};
const checkAvailability = async (roomType, checkInDate, checkOutDate, guests) => {
  const response = await axios.get(`${BASE_URL}/check-availability`, {
    params: {
      roomType,
      checkInDate,
      checkOutDate,
      guests,
      status: 'available',
    },
  });
  return response.data.isAvailable;
};

const roomService = {
  getAvailableRooms,
  getRoomTypes,
  checkAvailability,
};
export default roomService;