import axios from 'axios';
import roomService from './RoomService';

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
const handleError = (error, action) => {
  const message = error.response?.data?.message || error.message || 'Error desconocido';
  throw new Error(`Error al ${action}: ${message}`);
};

// Métodos del servicio
const getReservation = async (token, reservationId) => {
  try {
    // Convertimos y validamos el ID
    const id = String(reservationId).trim();
    
    if (!id) {
      throw new Error('Se requiere un ID de reserva válido');
    }

    const api = createAxiosInstance(token);
    const response = await api.get(`${API_URL}/${id}`);

    // Verificamos que la respuesta contenga datos
    if (!response.data) {
      throw new Error('No se encontró la reserva solicitada');
    }

    return response.data;
    
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Reserva no encontrada');
    }
    handleError(error, 'obtener la reserva');
  }
};
const createReservation = async (token, reservationData) => {
  try {
    const formattedData = {
      roomId: reservationData.roomId.toString(), // ID manual de la habitación
      checkIn: reservationData.checkInDate,
      checkOut: reservationData.checkOutDate,
      datosCompletos: {
        roomTypeId: reservationData.roomId.toString(), // Mismo ID manual
        checkIn: reservationData.checkInDate,
        checkOut: reservationData.checkOutDate,
        guestsNumber: parseInt(reservationData.numberOfGuests),
        userId: reservationData.userId
      }
    };

    const response = await axios.post(`${API_URL}`, formattedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    throw new Error(`Error al crear la reserva: ${error.message}`);
  }
};

const confirmPayment = async (token, reservationId, paymentData) => {
  try {
    const api = createAxiosInstance(token);
    const response = await api.post(`${API_URL}/payment`, paymentData);
    return response.data;
  } catch (error) {
    handleError(error, 'confirmar el pago');
  }
};

const getUserReservations = async (token, userId) => {
  try {
    const api = createAxiosInstance(token);
    
    // Usamos el endpoint específico para reservas de usuario
    const response = await api.get(`${API_URL}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: {
        userId: userId.replace('google-oauth2|', '')
    }    
    });
    
    console.log('Datos de reservas:', response.data);
    return response.data || [];
    
  } catch (error) {
    console.log('Detalles de la petición:', {
      url: error.config?.url,
      params: error.config?.params
    });
    return [];
  }
};

const updateReservation = async (token, reservationId, reservationData) => {
  try {
    if (!reservationId) throw new Error('ID de reserva requerido');
    const api = createAxiosInstance(token);
    const response = await api.patch(`${API_URL}/:id`, reservationData);
    return response.data;
  } catch (error) {
    handleError(error, 'actualizar la reserva');
  }
};

const deleteReservation = async (token, reservationId) => {
  try {
    if (!reservationId) throw new Error('ID de reserva requerido');
    const api = createAxiosInstance(token);
    const response = await api.delete(`${API_URL}/reservations/:id`);
    return response.data;
  } catch (error) {
    handleError(error, 'eliminar la reserva');
  }
};

// Exportar el servicio
const reservationService = {
  getReservation,
  getUserReservations,
  createReservation,
  confirmPayment,
  updateReservation,
  deleteReservation,
};

export default reservationService;
