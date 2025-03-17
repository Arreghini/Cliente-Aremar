import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const ConfirmedPay = ({reservationId}) => {
    const { getAccessTokenSilently } = useAuth0();
    const [loading, setLoading] = useState(true);
    const [reservation, setReservation] = useState(null);
    const [error, setError] = useState(null);

    // Verificar el estado de la reserva al cargar el componente
    useEffect(() => {
        if (reservationId) {
            checkReservationStatus();
        } else {
            setLoading(false);
            setError("No se proporcionó un ID de reserva");
        }
    }, [reservationId]);

    const checkReservationStatus = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log("Verificando estado de reserva ID:", reservationId);
            
            const token = await getAccessTokenSilently();
            
            // Consultar el estado actual de la reserva en tu API
            const response = await axios.get(
                `http://localhost:3000/api/reservations/${reservationId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("Respuesta de la API:", response.data);
            setReservation(response.data);
        } catch (error) {
            console.error("Error verificando estado de la reserva:", error);
            console.error("Detalles del error:", error.response?.data || "No hay detalles adicionales");
            setError(error.response?.data?.message || error.message || "Error desconocido al verificar la reserva");
        } finally {
            setLoading(false);
        }
    };

    // Si no hay ID de reserva, mostrar mensaje apropiado
    if (!reservationId && !loading) {
        return (
            <div className="error-message p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <h2 className="font-bold text-lg">Error</h2>
                <p>No se proporcionó un ID de reserva válido.</p>
            </div>
        );
    }

    return (
        <div className="reservation-status-container p-4 border rounded-lg shadow-md">
            {loading ? (
                <div className="loading-message text-center p-4">
                    <p className="text-gray-600">Verificando estado de la reserva...</p>
                    <div className="loader mt-2 mx-auto w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="error-message p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <h2 className="font-bold text-lg">Error al Verificar Reserva</h2>
                    <p>{error}</p>
                    <p className="text-sm mt-2">ID de reserva: {reservationId || "No disponible"}</p>
                    <button
                        onClick={checkReservationStatus}
                        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Intentar Nuevamente
                    </button>
                </div>
            ) : reservation ? (
                <div className="reservation-details">
                    {reservation.status === 'confirmed' && (
                        <div className="confirmation-message p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                            <h2 className="font-bold text-xl">¡Reserva Confirmada!</h2>
                            <p className="mt-2">{reservation.mensaje || 'Su pago ha sido procesado exitosamente.'}</p>
                            <div className="mt-4 p-3 bg-white rounded shadow-sm">
                                <h3 className="font-semibold">Detalles de la Reserva:</h3>
                                <p>Fecha de entrada: {new Date(reservation.checkInDate).toLocaleDateString()}</p>
                                <p>Fecha de salida: {new Date(reservation.checkOutDate).toLocaleDateString()}</p>
                                <p>Huéspedes: {reservation.numberOfGuests}</p>
                                {reservation.totalPrice && <p>Precio total: ${reservation.totalPrice}</p>}
                            </div>
                        </div>
                    )}
                    
                    {reservation.status === 'pending' && (
                        <div className="pending-message p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                            <h2 className="font-bold text-xl">Reserva Pendiente</h2>
                            <p className="mt-2">Su reserva está pendiente de pago. Por favor complete el proceso de pago.</p>
                            <button
                                onClick={checkReservationStatus}
                                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                            >
                                Verificar Estado
                            </button>
                        </div>
                    )}
                    
                    {reservation.status === 'cancelled' && (
                        <div className="error-message p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            <h2 className="font-bold text-xl">Reserva Cancelada</h2>
                            <p className="mt-2">{reservation.mensaje || 'La reserva ha sido cancelada.'}</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="error-message p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <h2 className="font-bold text-lg">Error al Verificar Reserva</h2>
                    <p>No pudimos encontrar información sobre su reserva.</p>
                    <p className="text-sm mt-2">ID de reserva: {reservationId || "No disponible"}</p>
                    <button
                        onClick={checkReservationStatus}
                        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Intentar Nuevamente
                    </button>
                </div>
            )}
        </div>
    );
};

export default ConfirmedPay;
