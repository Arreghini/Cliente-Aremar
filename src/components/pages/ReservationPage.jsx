import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import reservationService from "../../services/ReservationService";
import roomService from "../../services/RoomService";
import { useAuth0 } from "@auth0/auth0-react";
import MisReservas from "../atoms/MisReservas";
import PayButton from "../atoms/PayButton";
import ConfirmedPay from "../atoms/ConfirmedPay";

const ReservationPage = () => {
  const location = useLocation();
  const { state } = location || {};
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get('status'); // Obtener estado de pago de la URL

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
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  const [reservationId, setReservationId] = useState(null);

  const { getAccessTokenSilently, user, isLoading } = useAuth0();
  const [userId, setUserId] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  // Verificar si hay un ID de reserva en los parámetros de búsqueda
  const reservationIdFromUrl = searchParams.get('reservation_id');

  useEffect(() => {
    if (!isLoading && user) {
      setUserId(user.sub);
    }
  }, [user, isLoading]);

  useEffect(() => {
    // Si hay un ID de reserva en la URL y un estado de pago, mostrar el componente de verificación
    if (reservationIdFromUrl && paymentStatus) {
      // Convertir a número y verificar que sea válido
      const numericId = Number(reservationIdFromUrl);
      if (!isNaN(numericId)) {
        console.log("ReservationPage - ID de reserva desde URL:", numericId);
        setReservationId(numericId);
        setCreatedReservation({ id: numericId });
        setShowPaymentStatus(true);
        setShowPaymentButton(false);
      } else {
        console.error("ReservationPage - ID de reserva inválido en URL:", reservationIdFromUrl);
      }
    }
  }, [reservationIdFromUrl, paymentStatus]);

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

      const response = await reservationService.createReservation(token, newReservation);
      console.log("Reserva creada:", response);
      
      // Asegurarse de que el ID sea un número
      const numericId = Number(response.id);
      setReservationId(numericId);
      setCreatedReservation({ ...response, id: numericId, status: "pending" });
      setSuccessMessage("Reserva creada correctamente. Proceda al pago.");
      setShowPaymentButton(true);
      
      console.log("ReservationPage - ID de reserva creada:", numericId);
    } catch (error) {
      setErrorMessage(error.message || "Ocurrió un error al crear la reserva.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4">
      <MisReservas />
      <h1 className="text-2xl font-bold text-center">Crear Reserva</h1>
      <div className="mt-4 flex flex-col gap-4">
        {/* Mostrar el formulario solo si no estamos verificando un pago */}
        {!showPaymentStatus && (
          <>
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
          </>
        )}

        {!createdReservation && !showPaymentStatus ? (
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
        ) : showPaymentButton && createdReservation && !showPaymentStatus ? (
          <PayButton
            reservationId={reservationId}
            amount={createdReservation.totalPrice}
            currency="ARS"
          />
        ) : showPaymentStatus && reservationId ? (
          <ConfirmedPay
            reservationId={reservationId}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ReservationPage;
