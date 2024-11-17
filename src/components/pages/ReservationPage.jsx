import React, { useEffect, useState } from "react";
import reservationService from "../../services/ReservationService";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";

const ReservationPage = () => {
  const [reserve, setReserve] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const location = useLocation();

  // Extraemos los datos pasados desde el SearchBar
  const { roomType, checkInDate, checkOutDate, numberOfGuests } = location.state || {};

  useEffect(() => {
    const fetchReservation = async () => {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();

        const reservationData = {
          roomType,
          checkInDate,
          checkOutDate,
          numberOfGuests: parseInt(numberOfGuests, 10),
        };

        // Obtener reserva existente
        const response = await reservationService.getReservation(token, reservationData);

        if (response && response.length > 0) {
          setReserve(response[0]); // Asignamos la primera reserva si existen varias
        } else {
          setReserve(null); // No hay reservas existentes
        }
      } catch (error) {
        console.error("Error al obtener la reserva:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [getAccessTokenSilently, roomType, checkInDate, checkOutDate, numberOfGuests]);

  // Lógica para crear una reserva si no existe ninguna
  const handleCreateReservation = async () => {
    if (!reserve) {
      try {
        const token = await getAccessTokenSilently();

        const newReservationData = {
          roomType,
          checkInDate,
          checkOutDate,
          numberOfGuests: parseInt(numberOfGuests, 10),
        };

        const createdReservation = await reservationService.createReservation(token, newReservationData);
        setReserve(createdReservation); // Actualiza el estado con la nueva reserva
        console.log("Reserva creada exitosamente:", createdReservation);
      } catch (error) {
        console.error("Error al crear la reserva:", error);
      }
    } else {
      console.log("Ya existe una reserva para estas fechas y tipo de habitación.");
    }
  };

  // Lógica para actualizar la reserva si ya existe
  const handleUpdateReservation = async () => {
    if (reserve && reserve.id) {
      try {
        const token = await getAccessTokenSilently();

        const updatedReservationData = {
          roomType,
          checkInDate,
          checkOutDate,
          numberOfGuests: parseInt(numberOfGuests, 10),
        };

        const updatedReservation = await reservationService.updateReservation(token, reserve.id, updatedReservationData);
        setReserve(updatedReservation); // Actualiza el estado con la reserva actualizada
        console.log("Reserva actualizada exitosamente:", updatedReservation);
      } catch (error) {
        console.error("Error al actualizar la reserva:", error);
      }
    } else {
      console.log("No se pudo encontrar la reserva para actualizar.");
    }
  };

  // Lógica para eliminar la reserva si ya existe
  const handleDeleteReservation = async () => {
    if (reserve && reserve.id) {
      try {
        const token = await getAccessTokenSilently();
        await reservationService.deleteReservation(token, reserve.id);
        setReserve(null); // Actualiza el estado para indicar que no hay reserva
        console.log("Reserva eliminada exitosamente.");
      } catch (error) {
        console.error("Error al eliminar la reserva:", error);
      }
    } else {
      console.log("No se pudo encontrar la reserva para eliminar.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // Muestra botones para crear, actualizar o eliminar la reserva
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center">Detalles de la Reserva</h1>
      {reserve ? (
        <div className="mt-4">
          <p><strong>ID de Reserva:</strong> {reserve.id}</p>
          <p><strong>Tipo de Habitación:</strong> {reserve.roomType}</p>
          <p><strong>Check-In:</strong> {reserve.checkInDate}</p>
          <p><strong>Check-Out:</strong> {reserve.checkOutDate}</p>
          <p><strong>Huéspedes:</strong> {reserve.numberOfGuests}</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleUpdateReservation}
          >
            Actualizar Reserva
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleDeleteReservation}
          >
            Eliminar Reserva
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <p>No hay reserva para estas fechas y tipo de habitación.</p>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleCreateReservation}
          >
            Crear Reserva
          </button>
        </div>
      )}
    </div>
  );
};

export default ReservationPage;
