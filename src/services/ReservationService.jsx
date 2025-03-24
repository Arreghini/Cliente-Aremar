import axios from 'axios';

const API_URL = 'http://localhost:3000/api/reservations'; 
// Configuración general de Axios para incluir token automáticamente
const createAxiosInstance = (token) => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

// Manejo de errores
const handleError = (error) => {
  if (error.response) {
    console.error("Error en respuesta:", error.response.data);
  } else {
    console.error("Error desconocido:", error.message);
  }
  throw error;
};

// Métodos del servicio
const getReservation = async (token, reservationId) => {
  try {
    const parsedId = parseInt(reservationId);
    
    const response = await axios.get(`${API_URL}/${reservationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: {
        reservationId: parsedId
      }
    });
    
    console.log('ID solicitado:', parsedId);
    console.log('Respuesta del servidor:', response.data);
    
    return response.data;
    
  } catch (error) {
    console.log('Error detallado:', error.response);
    throw new Error(`Error al obtener la reserva: ${error.message}`);
  }
};

const createReservation = async (token, reservationData) => {
  try {
    const formattedData = {
      roomId: reservationData.roomId,
      checkIn: reservationData.checkInDate,
      checkOut: reservationData.checkOutDate,
      numberOfGuests: parseInt(reservationData.numberOfGuests),
      userId: reservationData.userId,
      totalPrice: reservationData.totalPrice,
    };

    console.log("Datos formateados a enviar:", formattedData);

    const response = await axios.post(`${API_URL}`, formattedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("Respuesta del backend al crear reserva:", response.data);
    return response.data.data; // Devuelve directamente la reserva creada
  } catch (error) {
    throw new Error(`Error al crear la reserva: ${error.message}`);
  }
};

// Nuevo método para crear orden de pago
const createPaymentOrder = async (token, reservationId, amount) => {
  try {
    const response = await axios.post(
      `${API_URL}/${reservationId}/payment-order`,
      { amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Error al crear orden de pago');
  }
};

const createPaymentPreference = async (token, reservationId, amount) => {
  try {
    const axiosInstance = createAxiosInstance(token);
    const response = await axiosInstance.post(`${reservationId}/create-preference`, { reservationId, amount });
    return response.data.preferenceId;
  } catch (error) {
    handleError(error);
  }
};

const getUserReservations = async (token, userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Estructura completa de la respuesta:', response.data);
    return response.data.data; // Devuelve directamente el array de reservas
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    return []; // Devuelve un array vacío en caso de error
  }
};
const updateReservation = async (token, reservationId, reservationData) => {
  try {
    const requestData = {
      método: 'PATCH',
      ruta: `/${reservationId}`,
      body: {
        checkIn: new Date(reservationData.checkIn).toISOString(),
        checkOut: new Date(reservationData.checkOut).toISOString(),
        numberOfGuests: parseInt(reservationData.numberOfGuests),
        roomId: reservationData.roomId,
        status: reservationData.status,
      }
    };

    console.log('Datos enviados al servidor:', JSON.stringify(requestData, null, 2));
    
    const response = await axios.patch(
      `${API_URL}/${reservationId}`, 
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.log('Error completo:', error.response);
    throw new Error(`Error al actualizar la reserva: ${error.response?.data?.message || error.message}`);
  }
};

const deleteReservation = async (token, reservationId) => {
  try {
    if (!reservationId) throw new Error('ID de reserva requerido');
    const api = createAxiosInstance(token);
    const response = await api.delete(`${API_URL}/${reservationId}`);  
    return response.data;
  } catch (error) {
    handleError(error, 'eliminar la reserva');
  }
};

const reservationService = {
  getReservation,
  getUserReservations,
  createReservation,
  createPaymentOrder,
  createPaymentPreference,
  updateReservation,
  deleteReservation,
};

export default reservationService;
