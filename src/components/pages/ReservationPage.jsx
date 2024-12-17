import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import reservationService from "../../services/ReservationService";
import roomService from "../../services/RoomService";
import { useAuth0 } from "@auth0/auth0-react";
import MisReservas from "../atoms/MisReservas";
import Payment from "../organisms/Payments";

const ReservationPage = () => {
  const location = useLocation();
  const { state } = location || {};
  const [roomTypeId, setRoomTypeId] = useState(state?.roomTypeId || "");
  const [roomTypeName, setRoomTypeName] = useState(state?.roomTypeName || "");
  const [checkInDate, setCheckInDate] = useState(state?.checkInDate || "");
  const [checkOutDate, setCheckOutDate] = useState(state?.checkOutDate || "");
  const [numberOfGuests, setNumberOfGuests] = useState(state?.numberOfGuests || "");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently, user, isLoading } = useAuth0();
  const [userId, setUserId] = useState(null);
  const [createdReservation, setCreatedReservation] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!isLoading && user) {
      setUserId(user.sub);
    }
  }, [user, isLoading]);

  useEffect(() => {
    const checkRoomAvailability = async () => {
      if (checkInDate && checkOutDate && roomTypeId) {
        try {
          const token = await getAccessTokenSilently();
          const isAvailable = await roomService.checkAvailability(
            token,
            roomTypeId,
            checkInDate,
            checkOutDate,
            numberOfGuests
          );
          setErrorMessage(
            isAvailable
              ? ""
              : "No hay habitaciones disponibles para el rango de fechas seleccionado."
          );
        } catch (error) {
          console.error("Error verificando disponibilidad:", error);
        }
      }
    };
    checkRoomAvailability();
  }, [roomTypeId, checkInDate, checkOutDate, numberOfGuests, getAccessTokenSilently]);

  const handleCreateReservation = async () => {
    setIsProcessing(true);
    try {
      const token = await getAccessTokenSilently();

      if (!roomTypeId || !checkInDate || !checkOutDate || !numberOfGuests) {
        throw new Error("Faltan datos requeridos para la reserva");
      }

      const availableRooms = await roomService.getAvailableRoomsByType(
        token,
        roomTypeId,
        checkInDate,
        checkOutDate,
        numberOfGuests
      );

      if (!availableRooms.rooms || availableRooms.rooms.length === 0) {
        throw new Error("No hay habitaciones disponibles");
      }

      const selectedRoom = availableRooms.rooms[0];
      const newReservation = {
        roomId: selectedRoom.id.toString(),
        checkInDate,
        checkOutDate,
        numberOfGuests: parseInt(numberOfGuests),
        userId,
        roomTypeId: selectedRoom.roomTypeId,
      };

      const response = await reservationService.createReservation(token, newReservation);

     // La reserva se crea con estado 'pending'
     setCreatedReservation({
      ...response,
      id: response.id,
      totalPrice: response.totalPrice || availableRooms.price,
      status: 'pending'
    });
    
    setSuccessMessage("Reserva creada. Por favor, complete el pago.");
  } catch (error) {
    setErrorMessage(error.message);
  } finally {
    setIsProcessing(false);
  }
};

  const handlePaymentSuccess = async () => {
    setSuccessMessage("¡Pago realizado con éxito!");
  };

  const handlePaymentError = (error) => {
    setErrorMessage(`Error en el pago: ${error}`);
  };

  return (
    <div className="p-4">
      <MisReservas />
      <h1 className="text-2xl font-bold text-center">Crear Reserva</h1>
      <div className="mt-4 flex flex-col gap-4">
        <input
          type="text"
          value={roomTypeName}
          readOnly
          className="p-2 border rounded-md bg-gray-100"
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
          min={checkInDate || today}
        />
        <input
          type="number"
          placeholder="Número de huéspedes"
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(e.target.value)}
          className="p-2 border rounded-md"
          min="1"
          max="4"
        />
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        {successMessage && <div className="text-green-500">{successMessage}</div>}

        {!createdReservation ? (
          <button
            onClick={handleCreateReservation}
            disabled={isProcessing || !!errorMessage}
            className={`p-2 rounded-md ${
              isProcessing || errorMessage
                ? "bg-gray-400"
                : "bg-blue-500 text-white"
            }`}
          >
            {isProcessing ? "Procesando..." : "Crear Reserva"}
          </button>
        ) : (
          <Payment
            reservationId={createdReservation.id}
            amount={createdReservation.totalPrice}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        )}
      </div>
    </div>
  );
};

export default ReservationPage;
