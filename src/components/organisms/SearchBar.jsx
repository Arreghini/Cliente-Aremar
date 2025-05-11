import React, { useEffect, useState } from 'react';
import roomService from '../../services/RoomService';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const SearchBar = () => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomType, setRoomType] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { getAccessTokenSilently } = useAuth0(); // Extraer el método para obtener el token
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const token = await getAccessTokenSilently();
        const types = await roomService.getRoomTypes(token);
        console.log('Tipos de habitación recibidos:', types);
        setRoomTypes(types);
      } catch (error) {
        console.error('Error obteniendo tipos de habitaciones:', error);
      }
    };
  
    fetchRoomTypes();
  }, [getAccessTokenSilently]);

  const today = new Date().toISOString().split('T')[0];
  const minCheckoutDate = checkInDate || today;

  const handleSearch = async () => {
    try {
      const token = await getAccessTokenSilently();

      // Validar y convertir los valores antes de enviarlos
      const parsedGuests = parseInt(numberOfGuests, 10);
      if (isNaN(parsedGuests) || parsedGuests <= 0) {
        throw new Error('El número de huéspedes debe ser un valor válido.');
      }

      const reservationId = '';

      const response = await roomService.checkAvailability(
        token,
        reservationId,
        roomType,
        checkInDate,
        checkOutDate,
        parsedGuests
      );

      console.log('Respuesta del backend:', response);

      // Actualizar el estado según la respuesta del backend
      setIsAvailable(response.isAvailable);
      setSuccessMessage(
        response.isAvailable
          ? '¡Habitación disponible! Puedes proceder con tu reserva.'
          : 'No hay habitaciones disponibles para las fechas seleccionadas.'
      );
    } catch (error) {
      console.error('Error al buscar disponibilidad:', error.message);
      setIsAvailable(false);
      setSuccessMessage('Ocurrió un error al buscar disponibilidad.');
    }
  };
  
  const handleBooking = () => {
    const selectedRoomType = roomTypes.find((type) => type.id === roomType);
    
    navigate('/reserve', {
      state: {
        roomTypeId: selectedRoomType.id, // Guardamos el ID (UUID)
        roomType: selectedRoomType.roomType, // Guardamos el nombre para mostrar
        checkInDate,
        checkOutDate,
        numberOfGuests: parseInt(numberOfGuests, 10),
      },
    });
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Habitaciones disponibles</h1>
      <div className="flex flex-row gap-4 items-center">
        <input
          type="number"
          placeholder="Número de huéspedes"
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(e.target.value)}
          className="p-2 border rounded-md"
          min="1"
          max="4" // Añadimos un límite máximo
        />
        <input
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          className="p-2 border rounded-md"
          min={today}
        />
        <input
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          className="p-2 border rounded-md"
          min={minCheckoutDate}
        />
        <select
  name="roomType"
  value={roomType}
  onChange={(e) => setRoomType(e.target.value)}
  className="border border-gray-300 p-2 rounded-md"
>
  <option value="">Selecciona un tipo</option>
  {roomTypes.map((type) => (
    <option key={type.id} value={type.id}>
      {type.name} - Precio diario: ${type.price} 
    </option>
  ))}
</select>
        <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded-md">
          Buscar
        </button>
      </div>

      {successMessage && (
        <div
          className={`mt-4 p-2 rounded-md text-center ${
            isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {successMessage}
        </div>
      )}

      {isAvailable && (
        <button
          onClick={handleBooking}
          className="mt-4 p-2 bg-green-500 text-white rounded-md"
        >
          Reservar ahora
        </button>
      )}
    </div>
  );
};

export default SearchBar;
