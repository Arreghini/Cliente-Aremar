import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import reservationService from "../../services/ReservationService";
import roomService from "../../services/RoomService";
import { useAuth0 } from "@auth0/auth0-react";
import MisReservas from "../atoms/MisReservas";

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

  // Definimos today aquí
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
          if (!isAvailable) {
            setErrorMessage("No hay habitaciones disponibles para el rango de fechas seleccionado.");
          } else {
            setErrorMessage("");
          }
        } catch (error) {
          console.error("Error verificando disponibilidad:", error);
        }
      }
    };
    checkRoomAvailability();
  }, [roomTypeId, checkInDate, checkOutDate, numberOfGuests, getAccessTokenSilently]);  // Actualizada la dependencia
  
  const handleCreateReservation = async () => {
    try {
      const token = await getAccessTokenSilently();
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
      
      const reservationData = {
        roomId: selectedRoom.id.toString(), // Aseguramos que sea string
        checkInDate,
        checkOutDate,
        numberOfGuests: parseInt(numberOfGuests),
        userId,
        roomTypeId: selectedRoom.roomTypeId
      };
  
      await reservationService.createReservation(token, reservationData);
      setSuccessMessage("¡Reserva creada exitosamente!");
    } catch (error) {
      setErrorMessage(error.message);
    }
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
        <button
          onClick={handleCreateReservation}
          disabled={isProcessing || errorMessage.includes("No hay habitaciones disponibles")}
          className={`p-2 rounded-md ${
            isProcessing || errorMessage.includes("No hay habitaciones disponibles")
              ? "bg-gray-400"
              : "bg-blue-500 text-white"
          }`}
        >
          {isProcessing ? "Procesando..." : "Crear Reserva"}
        </button>
      </div>
    </div>
  );
};

export default ReservationPage;
