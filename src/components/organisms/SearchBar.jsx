import React, { useEffect, useState } from 'react';
import roomService from '../../services/RoomService';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const SearchBar = () => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { getAccessTokenSilently } = useAuth0(); // Extraer el método para obtener el token
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await roomService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.error('Error obteniendo tipos de habitaciones:', error);
      }
    };

    fetchRoomTypes();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const minCheckoutDate = checkInDate || today;

  const handleSearch = async () => {
    try {
      const token = await getAccessTokenSilently();
      const available = await roomService.checkAvailability(token,
        selectedRoomType,   // Tipo de habitación
        checkInDate,        // Fecha de entrada
        checkOutDate,       // Fecha de salida
        numberOfGuests      // Número de huéspedes
      );
      setIsAvailable(available);
      if (available) {
        setSuccessMessage('¡Hay habitaciones disponibles para tu búsqueda!');
      } else {
        setSuccessMessage('Lo siento, no hay habitaciones disponibles para esas fechas.');
      }
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
    }
  };
  

  const handleBooking = () => {
    navigate('/reserva', {
      state: {
        roomType: selectedRoomType,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: numberOfGuests
      }
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
          value={selectedRoomType}
          onChange={(e) => setSelectedRoomType(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="">Selecciona un tipo</option>
          {roomTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>        
        <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded-md">
          Buscar
        </button>
      </div>
      
      {successMessage && (
        <div className={`mt-4 p-2 rounded-md text-center ${isAvailable ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
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
