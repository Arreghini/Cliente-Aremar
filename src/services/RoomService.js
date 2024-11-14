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
const checkAvailability = async (numberOfGuests, selectedRoomType, checkInDate, checkOutDate, roomType, status) => {
  const response = await axios.get(`${BASE_URL}/available`, {
    params: {
      numberOfGuests,
      selectedRoomType,
      checkInDate,
      checkOutDate,
      roomType,
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