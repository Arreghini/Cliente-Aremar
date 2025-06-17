import React, { useEffect, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaRegCalendarAlt } from 'react-icons/fa';
import roomService from '../../services/RoomService';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomType, setRoomType] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        setIsLoading(true);
        const types = await roomService.getRoomTypes();
        setRoomTypes(Array.isArray(types) ? types : types?.data || []);
      } catch (error) {
        console.error('Error obteniendo tipos de habitaciones:', error);
        setRoomTypes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomTypes();
  }, []);

  const handleSearch = async () => {
    try {
      if (!numberOfGuests || isNaN(parseInt(numberOfGuests)) || parseInt(numberOfGuests) <= 0) {
        throw new Error('Número de huéspedes inválido.');
      }

      if (!startDate || !endDate) {
        throw new Error('Debes seleccionar ambas fechas.');
      }

      if (endDate < startDate) {
        throw new Error('La fecha de salida debe ser posterior a la de entrada.');
      }

      const response = await roomService.checkAvailability(
        '',
        roomType,
        startDate,
        endDate,
        parseInt(numberOfGuests)
      );

      setIsAvailable(response.isAvailable);
      setSuccessMessage(response.isAvailable
        ? '¡Habitación disponible! Puedes proceder con tu reserva.'
        : 'No hay disponibilidad en esas fechas.');
    } catch (error) {
      setIsAvailable(false);
      setSuccessMessage(error.message || 'Error al buscar disponibilidad.');
    }
  };

  const handleBooking = () => {
    const selectedRoomType = roomTypes.find((type) => type.id === roomType);

    navigate('/reserve', {
      state: {
        roomTypeId: selectedRoomType?.id,
        roomType: selectedRoomType?.roomType,
        checkIn: startDate,
        checkOut: endDate,
        numberOfGuests: parseInt(numberOfGuests, 10),
      },
    });
  };

  if (isLoading) {
    return <div className="text-center">Cargando tipos de habitación...</div>;
  }
const formatDate = (date) => {
  return date.toLocaleDateString('es-AR', {
    weekday: 'short',   // día de la semana (abreviado)
    day: '2-digit',     // número del día
    month: 'short',     // mes abreviado
  }).replace(/\.$/, '').toUpperCase(); // quita punto final y pone mayúsculas
};

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Habitaciones disponibles</h1>
      <div className="flex flex-wrap gap-4 items-center justify-center">
        {/* Huéspedes */}
        <input
          type="number"
          placeholder="Huéspedes"
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(e.target.value)}
          className="p-2 border rounded-md w-32"
          min="1"
          max="4"
        />

        {/* Fecha (Checkin + Checkout en un solo campo) */}
        <div className="relative w-64">
          <DatePicker
            ref={calendarRef}
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
            placeholderText="ELEGÍ LAS FECHAS"
            minDate={new Date()}
            customInput={
              <div
                className="flex items-center justify-between w-full cursor-pointer bg-white p-2 border border-gray-300 rounded-md"
                onClick={() => calendarRef.current.setFocus()}
              >
                <span className="text-gray-500 text-sm">
                 {startDate && endDate
                  ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                  : 'ELEGÍ LAS FECHAS'}
                </span>
                <FaRegCalendarAlt className="text-gray-500 ml-2" />
              </div>
            }
          />
        </div>

        {/* Tipo de habitación */}
        <select
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-48"
        >
          <option value="">Selecciona un tipo</option>
          {roomTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name} - ${type.price}/noche
            </option>
          ))}
        </select>

        {/* Botón de búsqueda */}
        <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded-md">
          Buscar
        </button>
      </div>

      {/* Mensaje de disponibilidad */}
      {successMessage && (
        <div
          className={`mt-4 p-2 rounded-md text-center ${
            isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {successMessage}
        </div>
      )}

      {/* Botón de reservar */}
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
