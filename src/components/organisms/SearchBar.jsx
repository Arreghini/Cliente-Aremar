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
    if (!roomType || !checkInDate || !checkOutDate || !numberOfGuests || isNaN(numberOfGuests)) {
      setSuccessMessage('Por favor ingresa valores válidos en todos los campos');
      return;
    }
    try {
      const token = await getAccessTokenSilently();
      const available = await roomService.checkAvailability(
        token,
        roomType,
        checkInDate,
        checkOutDate,
        numberOfGuests
      );
  
      console.log('Estado de disponibilidad:', available);
      setIsAvailable(true);
      setSuccessMessage('¡Habitaciones disponibles!');
  
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setSuccessMessage('Error al verificar disponibilidad');
    }
  };
  
  const handleBooking = () => {
    const guestsNumber = parseInt(numberOfGuests, 10);
  
    if (isNaN(guestsNumber)) {
      setSuccessMessage('El número de huéspedes debe ser válido');
      return;
    }
  
  // Enviar el `name` del tipo de habitación al reservar
  const selectedRoomType = roomTypes.find((type) => type.id === roomType);

  navigate('/reserve', {
    state: {
      roomType: selectedRoomType?.name || '', // Enviar el nombre
      checkInDate,
      checkOutDate,
      numberOfGuests: guestsNumber,
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
  max="4"  // Añadimos un límite máximo
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
