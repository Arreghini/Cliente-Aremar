import React, { useEffect, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  FaRegCalendarAlt,
  FaUser,
  FaChild,
  FaPlusCircle,
  FaMinusCircle,
  FaBuilding,
} from 'react-icons/fa';
import roomService from '../../services/RoomService';
import { useNavigate } from 'react-router-dom';
import RoomResultCard from './RoomResultCard';

const SearchBar = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomType, setRoomType] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [showRoomTypeMenu, setShowRoomTypeMenu] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAdultControls, setShowAdultControls] = useState(false);
  const [showChildControls, setShowChildControls] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const calendarWrapperRef = useRef(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    setNumberOfGuests(adults + children);
  }, [adults, children]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarWrapperRef.current &&
        !calendarWrapperRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async () => {
    try {
      if (numberOfGuests <= 0 || numberOfGuests > 4) {
        throw new Error('Número de huéspedes inválido.');
      }
      if (!startDate || !endDate) {
        throw new Error('Debes seleccionar ambas fechas.');
      }
      if (endDate < startDate) {
        throw new Error(
          'La fecha de salida debe ser posterior a la de entrada.'
        );
      }

      const response = await roomService.checkAvailability(
        '',
        roomType,
        startDate,
        endDate,
        numberOfGuests
      );

      setIsAvailable(response.isAvailable);

        if (response.isAvailable && response.availableRooms?.length > 0) {
      setSelectedRoom(response.availableRooms[0]); // 👈 primera disponible
    }
      setSuccessMessage(
        response.isAvailable
          ? '¡Habitación disponible! Puedes proceder con tu reserva.'
          : 'No hay disponibilidad en esas fechas.'
      );
    } catch (error) {
      setIsAvailable(false);
      setSuccessMessage(error.message || 'Error al buscar disponibilidad.');
    }
  };

const handleBooking = () => {
  if (!startDate || !endDate) {
    alert('Selecciona ambas fechas');
    return;
  }

  if (!selectedRoom) {
    alert('No se ha seleccionado ninguna habitación disponible');
    return;
  }

  const formatDateForInput = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  navigate('/reserve', {
    state: {
      roomId: selectedRoom.id,              // ✅ ID de la habitación real
      roomTypeName: selectedRoom.roomType,  // ✅ nombre del tipo
      roomImage: selectedRoom.photoRoom,     // ✅ foto real
      checkIn: formatDateForInput(startDate),
      checkOut: formatDateForInput(endDate),
      numberOfGuests,
    },
  });
};

  const formatDate = (date) => {
    return date
      .toLocaleDateString('es-AR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      })
      .replace(/\.$/, '')
      .toUpperCase();
  };

  if (isLoading) {
    return <div className="text-center">Cargando tipos de habitación...</div>;
  }

  return (
    <div className="relative w-full sm:w-[100%] mx-auto p-0">
      <div
        className="flex flex-wrap md:flex-nowrap items-stretch justify-between bg-white p-3 rounded-xl 
    shadow-md gap-4 w-full h-[120px] z-10"
      >
        {/* Huéspedes */}
        <div className="flex-1 min-w-[200px] flex flex-col z-10 items-center justify-between border rounded-xl p-2 -z-30h-full shadow-sm">
          <span className="text-center text-xs text-gray-600 font-semibold mb-2">
            ¿QUIÉNES VAN?
          </span>
          <div className="flex items-center justify-around bg-white rounded-md p-2 gap-2">
            {/* Adultos */}
            <div className="flex flex-col items-center">
              <FaUser
                className="text-gray-700 cursor-pointer hover:text-blue-500"
                onClick={() => setShowAdultControls(!showAdultControls)}
              />
              <span className="text-sm">{adults}</span>
              {showAdultControls && (
                <div className="flex gap-1 mt-1">
                  <FaMinusCircle
                    className={`text-black cursor-pointer text-xs ${
                      adults <= 1 ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                  />
                  <FaPlusCircle
                    className={`text-black cursor-pointer text-xs ${
                      adults + children >= 4
                        ? 'opacity-40 cursor-not-allowed'
                        : ''
                    }`}
                    onClick={() => {
                      if (adults + children < 4) setAdults(adults + 1);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Niños */}
            <div className="flex flex-col items-center">
              <FaChild
                className="text-gray-700 cursor-pointer hover:text-blue-500"
                onClick={() => setShowChildControls(!showChildControls)}
              />
              <span className="text-sm">{children}</span>
              {showChildControls && (
                <div className="flex gap-1 mt-1">
                  <FaMinusCircle
                    className={`text-black cursor-pointer text-xs ${
                      children <= 0 ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                    onClick={() => setChildren(Math.max(0, children - 1))}
                  />
                  <FaPlusCircle
                    className={`text-black cursor-pointer text-xs ${
                      adults + children >= 4
                        ? 'opacity-40 cursor-not-allowed'
                        : ''
                    }`}
                    onClick={() => {
                      if (adults + children < 4) setChildren(children + 1);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fechas */}
        <div
          className="flex-1 min-w-[200px] flex flex-col items-center justify-between border rounded-xl 
        p-2 h-full z-10 shadow-sm relative"
        >
          <span className="text-center text-xs text-gray-600 font-semibold mb-2">
            ELEGÍ LAS FECHAS
          </span>
          <div
            className="flex justify-center items-center cursor-pointer hover:text-blue-500"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <FaRegCalendarAlt size={24} />
          </div>

          {showCalendar && (
            <div
              ref={calendarWrapperRef}
              className="absolute top-full left-0 mt-2 z-20 bg-white shadow-lg rounded-md border border-gray-300"
            >
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={([start, end]) => {
                  setStartDate(start);
                  setEndDate(end);
                  if (start && end) {
                    setTimeout(() => setShowCalendar(false), 200);
                  }
                }}
                inline
                minDate={new Date()}
              />
            </div>
          )}

          {startDate && endDate && (
            <div className="mt-2 text-sm text-center font-semibold text-gray-700 bg-gray-100 rounded-md p-1">
              {`${formatDate(startDate)} - ${formatDate(endDate)}`}
            </div>
          )}
        </div>

        {/* Tipo de habitación */}
        <div
          className="flex-1 min-w-[200px] flex flex-col items-center justify-between 
        tramado-romboidal w-full h-screenborder rounded-xl p-2 h-full z-10 shadow-sm relative"
        >
          <span className="text-center text-xs text-neutral-oscuro font-semibold mb-2">
            TIPO DE HABITACIÓN
          </span>
          <div
            className="flex justify-center items-center cursor-pointer hover:text-blue-500"
            onClick={() => setShowRoomTypeMenu(!showRoomTypeMenu)}
          >
            <FaBuilding size={24} />
          </div>
          {showRoomTypeMenu && (
            <div className="absolute top-full left-0 w-full mt-2 z-10 bg-white border border-gray-300 rounded-md shadow-md">
              {roomTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setRoomType(type.id);
                    setShowRoomTypeMenu(false);
                  }}
                  className={`w-full text-left p-2 hover:bg-blue-100 ${
                    roomType === type.id ? 'bg-blue-200 font-semibold' : ''
                  }`}
                >
                  {type.name} - ${type.price}/noche
                </button>
              ))}
            </div>
          )}
          {roomType && (
            <div className="mt-2 text-sm text-center font-semibold text-neutral-claro bg-gray-100 rounded-md p-1">
              {roomTypes.find((type) => type.id === roomType)?.name}
            </div>
          )}
        </div>

        {/* Botón Buscar */}
        <button
          onClick={handleSearch}
          className="w-full md:w-[120px] h-full z-10 bg-blue-400 text-neutral-oscuro font-semibold text-xs rounded-xl shadow-sm 
          hover:bg-blue-500 transition self-center"
        >
          BUSCAR
        </button>
      </div>

     {/* Resultado */}
{successMessage && (
  <div
    className={`mt-4 p-2 rounded-md text-center ${
      !isAvailable
        ? 'bg-red-100 text-red-700'
        : 'bg-green-100 text-green-700'
    }`}
  >
    {successMessage}
  </div>
)}

{/* Si hay disponibilidad, muestro la card con foto + botón */}
{isAvailable && selectedRoom && (
  <RoomResultCard room={selectedRoom} onReserve={handleBooking} />
)}    
    </div>


  );
};

export default SearchBar;
