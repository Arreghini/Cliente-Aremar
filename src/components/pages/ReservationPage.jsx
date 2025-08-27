import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import reservationService from '../../services/ReservationService';
import roomService from '../../services/RoomService';
import { useAuth0 } from '@auth0/auth0-react';
import PaymentOptions from '../atoms/PaymentOptions';

const ReservationPage = () => {
  const location = useLocation();
  const { state } = location || {};

  const roomTypeId = state?.roomTypeId || '';
  const roomTypeName = state?.roomTypeName || '';

  const [checkIn, setCheckIn] = useState(state?.checkIn || '');
  const [checkOut, setCheckOut] = useState(state?.checkOut || '');
  const [numberOfGuests, setNumberOfGuests] = useState(
    state?.numberOfGuests || 1
  );

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdReservation, setCreatedReservation] = useState(null);
  const [showPaymentButton, setShowPaymentButton] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const { getAccessTokenSilently, user, isLoading } = useAuth0();
  const [userId, setUserId] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!isLoading && user) {
      setUserId(user.sub);
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (createdReservation?.id) {
      setShowPaymentButton(true);
    }
  }, [createdReservation]);

  const handleCreateReservation = async () => {
    if (!roomTypeId || !checkIn || !checkOut || !numberOfGuests) {
      setErrorMessage('Faltan datos requeridos para la reserva');
      return;
    }

    const checkInDate = new Date(checkIn + 'T00:00:00');
    const checkOutDate = new Date(checkOut + 'T00:00:00');

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      setErrorMessage('Las fechas seleccionadas no son válidas.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const token = await getAccessTokenSilently();

      const availableRooms = await roomService.getAvailableRoomsByType(
        token,
        roomTypeId,
        checkInDate,
        checkOutDate,
        numberOfGuests
      );

      if (!availableRooms.rooms?.length) {
        throw new Error('No hay habitaciones disponibles');
      }

      const room = availableRooms.rooms[0];
      setSelectedRoom(room); // Guardamos la habitación seleccionada para mostrar la foto
console.log('Selected Room:', room);
      const newReservation = {
        roomId: room.id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        numberOfGuests: Number(numberOfGuests),
        userId,
        roomTypeId: room.roomTypeId,
      };

      const created = await reservationService.createReservation(
        token,
        newReservation
      );
      setCreatedReservation({ ...created, status: 'pending' });
      setSuccessMessage('Reserva creada correctamente. Proceda al pago.');
    } catch (error) {
      setErrorMessage(error.message || 'Ocurrió un error al crear la reserva.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-neutral-oscuro min-h-screen text-neutral-100">
      <div className="p-8 max-w-2xl mx-auto font-body">
        <h1 className="text-3xl mt-16 font-heading text-playa-sol text-center mb-6">
          Crear Reserva
        </h1>

        <div className="flex flex-col gap-4 bg-neutral-claro p-6 rounded-xl shadow-lg text-neutral-800">
          {/* Foto de la habitación */}
          {selectedRoom?.imageUrl && (
            <img
              src={selectedRoom.imageUrl}
              alt={`Imagen de ${roomTypeName}`}
              className="w-full h-64 object-cover rounded-xl mb-4"
            />
          )}

          {/* Nombre de la habitación */}
          <input
            type="text"
            value={roomTypeName}
            readOnly
            className="p-3 border rounded-md bg-gray-100"
          />

          {/* Fechas */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="p-3 border rounded-md flex-1"
              min={today}
              required
            />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="p-3 border rounded-md flex-1"
              min={checkIn || today}
              required
            />
          </div>

          {/* Número de huéspedes */}
          <input
            type="number"
            placeholder="Número de huéspedes"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(e.target.value)}
            className="p-3 border rounded-md"
            min="1"
            max="4"
          />

          {/* Mensajes */}
          {errorMessage && (
            <div className="text-red-400 font-medium">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-400 font-medium">{successMessage}</div>
          )}

          {/* Botón crear reserva */}
          {!createdReservation ? (
            <button
              onClick={handleCreateReservation}
              disabled={
                isProcessing ||
                !!errorMessage ||
                !roomTypeId ||
                !checkIn ||
                !checkOut ||
                !numberOfGuests
              }
              className={`p-3 font-semibold rounded-md transition-all duration-300 ${
                isProcessing || errorMessage
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-mar-profundo text-white hover:bg-mar-claro'
              }`}
            >
              {isProcessing ? 'Procesando...' : 'Crear Reserva'}
            </button>
          ) : (
            showPaymentButton &&
            createdReservation?.id && (
              <div className="mt-4">
                <PaymentOptions reservation={createdReservation} />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
