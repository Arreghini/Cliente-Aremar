import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import reservationService from "../../services/ReservationService";
import roomService from "../../services/RoomService";
import { useAuth0 } from "@auth0/auth0-react";
import MisReservas from "../atoms/MisReservas";
import PayButton from "../atoms/PayButton";
import ConfirmedPay from "../atoms/ConfirmedPay"; 

const ReservationPage = () => {
  const location = useLocation();
  const { state } = location || {};

  // Estados de la reserva
  const [roomTypeId, setRoomTypeId] = useState(state?.roomTypeId || "");
  const [roomTypeName, setRoomTypeName] = useState(state?.roomTypeName || "");
  const [checkInDate, setCheckInDate] = useState(state?.checkInDate || "");
  const [checkOutDate, setCheckOutDate] = useState(state?.checkOutDate || "");
  const [numberOfGuests, setNumberOfGuests] = useState(state?.numberOfGuests || "");

  // Estados de feedback y lógica
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdReservation, setCreatedReservation] = useState(null);
  const [showPaymentButton, setShowPaymentButton] = useState(false);

  const { getAccessTokenSilently, user, isLoading } = useAuth0();
  const [userId, setUserId] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!isLoading && user) {
        console.log("User ID desde Auth0:", user.sub);
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
    if (!roomTypeId || !checkInDate || !checkOutDate || !numberOfGuests) {
        setErrorMessage("Faltan datos requeridos para la reserva");
        return;
    }

    setIsProcessing(true);
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
            throw new Error("No hay habitaciones disponibles");
        }

        const selectedRoom = availableRooms.rooms[0];
        const newReservation = {
            roomId: selectedRoom.id,
            checkInDate,
            checkOutDate,
            numberOfGuests: Number(numberOfGuests),
            userId,
            roomTypeId: selectedRoom.roomTypeId,
        };
        
        console.log("User ID enviado en la reserva:", userId);

        // Crear la reserva y obtener la respuesta directamente
        const createdReservation = await reservationService.createReservation(token, newReservation);

        console.log("Reserva creada:", createdReservation);
        const reservationId = createdReservation.id;
        
        setCreatedReservation({ ...createdReservation, status: "pending" });
        setSuccessMessage("Reserva creada correctamente. Proceda al pago.");
        setShowPaymentButton(true);
    } catch (error) {
        setErrorMessage(error.message || "Ocurrió un error al crear la reserva.");
    } finally {
        setIsProcessing(false);
    }
    console.log('ID de usuario recibido:', userId);
    console.log('ID de usuario en auth:', user?.sub);
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
            disabled={isProcessing || !!errorMessage || !roomTypeId || !checkInDate || !checkOutDate || !numberOfGuests}
            className={`p-2 rounded-md ${
              isProcessing || errorMessage
                ? "bg-gray-400"
                : "bg-blue-500 text-white"
            }`}
          >
            {isProcessing ? "Procesando..." : "Crear Reserva"}
          </button>
        ) : (
          <>
            {showPaymentButton && createdReservation?.id && (
              <PayButton
                reservationId={createdReservation.id}
                amount={createdReservation.totalPrice}
                currency="ARS"
                containerId={`wallet-container-${createdReservation.id}`}
              />
            )}
            <ConfirmedPay reservationId={createdReservation?.id} />
          </>
        )}
      </div>
    </div>
  );
};

export default ReservationPage;
