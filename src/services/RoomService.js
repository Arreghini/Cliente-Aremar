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
const checkAvailability = async  (token, roomType, checkInDate, checkOutDate, numberOfGuests) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/available`, {
      params: {
        roomType,
        checkInDate,
        checkOutDate,
        numberOfGuests 
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.available;
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
};

const roomService = {
  getAvailableRooms,
  getRoomTypes,
  checkAvailability,
};
export default roomService;