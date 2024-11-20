import React, { useEffect, useState } from "react";
import reservationService from "../../services/ReservationService";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useParams } from "react-router-dom";

const ReservationPage = () => {
  const [reserve, setReserve] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();
  const location = useLocation();
  const { id } = useParams();

  const { roomType, checkInDate, checkOutDate, numberOfGuests } = location.state || {};

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        const data = await reservationService.getReservation(token, id);
        
        if (data && Object.keys(data).length > 0) {
          setReserve(data);
        } else {
          setReserve(null);
        }
      } catch (error) {
        setError(error.message);
        console.error("Error al obtener la reserva:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReservation();
    }
  }, [id, getAccessTokenSilently]);
  
  const handleCreateReservation = async () => {
    setIsProcessing(true);
    try {
      const token = await getAccessTokenSilently();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }
      const createdReservation = await reservationService.createReservation(token, {
        roomType,
        checkInDate,
        checkOutDate,
        numberOfGuests
      });
      setReserve(createdReservation);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };  

  const handleConfirmPayment = async () => {
    if (reserve?.id) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently();
        const confirmationData = await reservationService.confirmPayment(token, reserve.id);

        setReserve(confirmationData.reservation);
        console.log("Pago confirmado exitosamente.");
      } catch (error) {
        console.error("Error al confirmar el pago:", error);
      } finally {
        setIsProcessing(false);
      }
    } else {
      console.log("No hay reserva disponible para confirmar el pago.");
    }
  };

  const handleUpdateReservation = async () => {
    if (reserve?.id) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently();

        const updatedReservationData = {
          roomType,
          checkInDate,
          checkOutDate,
          numberOfGuests: parseInt(numberOfGuests, 10),
        };

        const updatedReservation = await reservationService.updateReservation(token, reserve.id, updatedReservationData);
        setReserve(updatedReservation);
        console.log("Reserva actualizada exitosamente:", updatedReservation);
      } catch (error) {
        console.error("Error al actualizar la reserva:", error);
      } finally {
        setIsProcessing(false);
      }
    } else {
      console.log("No se pudo encontrar la reserva para actualizar.");
    }
  };

  const handleDeleteReservation = async () => {
    if (reserve?.id) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently();
        await reservationService.deleteReservation(token, reserve.id);

        setReserve(null);
        console.log("Reserva eliminada exitosamente.");
      } catch (error) {
        console.error("Error al eliminar la reserva:", error);
      } finally {
        setIsProcessing(false);
      }
    } else {
      console.log("No se pudo encontrar la reserva para eliminar.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center">Detalles de la Reserva</h1>
      {reserve ? (
        <div className="mt-4">
          <p><strong>ID de Reserva:</strong> {reserve.id || "No disponible"}</p>
          <p><strong>Tipo de Habitación:</strong> {reserve.roomType || "No disponible"}</p>
          <p><strong>Check-In:</strong> {reserve.checkInDate || "No disponible"}</p>
          <p><strong>Check-Out:</strong> {reserve.checkOutDate || "No disponible"}</p>
          <p><strong>Huéspedes:</strong> {reserve.numberOfGuests || "No disponible"}</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleUpdateReservation}
            disabled={isProcessing}
          >
            Actualizar Reserva
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleDeleteReservation}
            disabled={isProcessing}
          >
            Eliminar Reserva
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleConfirmPayment}
            disabled={isProcessing}
          >
            Confirmar Pago
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <p>No hay reserva para estas fechas y tipo de habitación.</p>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleCreateReservation}
            disabled={isProcessing}
          >
            Crear Reserva
          </button>
        </div>
      )}
    </div>
  );
};

export default ReservationPage;
