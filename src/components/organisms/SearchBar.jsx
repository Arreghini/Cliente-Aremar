import React, { useEffect, useState } from 'react';
import roomService from '../../services/RoomService';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const SearchBar = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomType, setRoomType] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        setIsLoading(true);
        const token = await getAccessTokenSilently();
        const types = await roomService.getRoomTypes(token);
        console.log('Tipos de habitación recibidos:', types);
        
        // Verificar que la respuesta sea un array
        if (Array.isArray(types)) {
          setRoomTypes(types);
        } else if (types && Array.isArray(types.data)) {
          // Si la respuesta viene envuelta en un objeto con propiedad 'data'
          setRoomTypes(types.data);
        } else {
          console.error('La respuesta no es un array:', types);
          setRoomTypes([]);
        }
      } catch (error) {
        console.error('Error obteniendo tipos de habitaciones:', error);
        setRoomTypes([]); // Asegurar que siempre sea un array
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchRoomTypes();
  }, [getAccessTokenSilently]);

  const handleSearch = async () => {
    try {
      const token = await getAccessTokenSilently();

      // Validar número de huéspedes
      if (!numberOfGuests) {
        throw new Error('Debes ingresar el número de huéspedes.');
      }
      const parsedGuests = parseInt(numberOfGuests, 10);
      if (isNaN(parsedGuests) || parsedGuests <= 0) {
        throw new Error('El número de huéspedes debe ser un valor válido.');
      }

      // Validar fechas
      if (!checkIn || !checkOut) {
        throw new Error('Debes seleccionar ambas fechas.');
      }
      if (checkOut < checkIn) {
        throw new Error('La fecha de check-out debe ser igual o posterior a la de check-in.');
      }

      const reservationId = '';

      const response = await roomService.checkAvailability(
        token,
        reservationId,
        roomType,
        checkIn,
        checkOut,
        parsedGuests
      );

      console.log('Respuesta del backend:', response);

      setIsAvailable(response.isAvailable);
      setSuccessMessage(
        response.isAvailable
          ? '¡Habitación disponible! Puedes proceder con tu reserva.'
          : 'No hay habitaciones disponibles para las fechas seleccionadas.'
      );
    } catch (error) {
      console.error('Error al buscar disponibilidad:', error.message);
      setIsAvailable(false);
      setSuccessMessage(error.message || 'Ocurrió un error al buscar disponibilidad.');
    }
  };
  
  const handleBooking = () => {
    const selectedRoomType = roomTypes.find((type) => type.id === roomType);
    
    navigate('/reserve', {
      state: {
        roomTypeId: selectedRoomType.id,
        roomType: selectedRoomType.roomType,
        checkIn,
        checkOut,
        numberOfGuests: parseInt(numberOfGuests, 10),
      },
    });
  };
  
  // Mostrar un indicador de carga mientras se obtienen los tipos de habitación
  if (isLoading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Habitaciones disponibles</h1>
        <div className="text-center">Cargando tipos de habitación...</div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Habitaciones disponibles</h1>
      <div className="flex flex-row w-full gap-4 items-center">
        <input
          type="number"
          placeholder="Huéspedes"
          name="numberOfGuests"
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(e.target.value)}
          className="p-2 border rounded-md w-32" 
          min="1"
          max="4"
        />
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="p-2 border rounded-md"
        />
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="p-2 border rounded-md"
          min={checkIn}
        />
        <select
          name="roomType"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-48"
        >
          <option value="">Selecciona un tipo</option>
          {/* Verificación adicional para asegurar que roomTypes es un array */}
          {Array.isArray(roomTypes) && roomTypes.map((type) => (
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
