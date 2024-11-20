import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import reservationService from "../../services/ReservationService";
import { useAuth0 } from "@auth0/auth0-react";

const ReservationPage = () => {
  const location = useLocation();
  const { state } = location || {};
  const [roomType, setRoomType] = useState(state?.roomType || "");
  const [checkInDate, setCheckInDate] = useState(state?.checkInDate || "");
  const [checkOutDate, setCheckOutDate] = useState(state?.checkOutDate || "");
  const [numberOfGuests, setNumberOfGuests] = useState(state?.numberOfGuests || "");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { getAccessTokenSilently, user, isLoading } = useAuth0();
  
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (!isLoading && user) {
      console.log("Nickname del usuario:", user.sub);
      setUserId(user.sub);  // Guardamos el userId aquí
    }
  }, [user, isLoading]);

  const handleCreateReservation = async () => {
    if (!roomType || !checkInDate || !checkOutDate || !numberOfGuests) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }
  
    setIsProcessing(true);
    try {
      const token = await getAccessTokenSilently();
      console.log('Datos de reserva:', {
        roomType,
        checkInDate,
        checkOutDate,
        numberOfGuests
      });
      
      const createdReservation = await reservationService.createReservation(token, {
        roomType: roomType.trim(), // Eliminamos espacios extras
        checkInDate,
        checkOutDate,
        numberOfGuests: parseInt(numberOfGuests),
        userId
      });
  
      setSuccessMessage("Reserva creada exitosamente");
      console.log("Reserva creada:", createdReservation);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsProcessing(false);
    }
  };  

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center">Crear Reserva</h1>
      <div className="mt-4 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Tipo de habitación"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          className="p-2 border rounded-md"
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
          disabled={isProcessing}
          className="p-2 bg-blue-500 text-white rounded-md"
        >
          {isProcessing ? "Procesando..." : "Crear Reserva"}
        </button>
      </div>
    </div>
  );
};

export default ReservationPage;
