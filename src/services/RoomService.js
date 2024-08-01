import axios from 'axios';

const getAvailableRooms = async (checkInDate, checkOutDate) => {
  const response = await axios.get('/api/rooms/available', {
    params: {
      checkInDate,
      checkOutDate,
    },
  });
  return response.data;
};

export default {
  getAvailableRooms,
};
