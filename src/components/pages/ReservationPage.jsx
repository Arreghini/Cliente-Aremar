import React, { useEffect, useState } from "react";
import reservationService from "../../services/ReservationService";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";

const ReservationPage = () => {
  const [reserve, setReserve] = useState({});
  const [loading, setLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const location = useLocation();

  // Extraemos los datos pasados desde el SearchBar
  const { roomType, checkIn, checkOut, guests } = location.state || {};

  useEffect(() => {
    const fetchReservation = async () => {
      if (!roomType || !checkIn || !checkOut || !guests) {
        console.error("Faltan datos para crear la reserva");
        return;
      }

      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const reservationData = {
          roomType,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          numberOfGuests: guests,
        };
        const response = await reservationService.createReservation(
          token,
          reservationData
        );
        setReserve(response);
      } catch (error) {
        console.error("Error al crear la reserva:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [getAccessTokenSilently, roomType, checkIn, checkOut, guests]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center">Detalles de la Reserva</h1>
      {reserve && reserve.id ? (
        <div className="mt-4">
          <p><strong>ID de Reserva:</strong> {reserve.id}</p>
          <p><strong>Tipo de Habitación:</strong> {reserve.roomType}</p>
          <p><strong>Check-In:</strong> {reserve.checkInDate}</p>
          <p><strong>Check-Out:</strong> {reserve.checkOutDate}</p>
          <p><strong>Huéspedes:</strong> {reserve.numberOfGuests}</p>
        </div>
      ) : (
        <p>No se pudo crear la reserva.</p>
      )}
    </div>
  );
};

export default ReservationPage;
