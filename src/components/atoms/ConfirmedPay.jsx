import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const ConfirmedPay = ({ reservationId }) => {
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const { getAccessTokenSilently } = useAuth0();

    console.log("Reservation ID:", reservationId);

    useEffect(() => {
        if (!reservationId) {
            setErrorMessage("No se proporcionó un ID de reserva válido.");
            setLoading(false);
            return;
        }

        const checkPaymentStatus = async () => {
            try {
                setLoading(true); // Inicia el estado de carga
                const token = await getAccessTokenSilently(); // Obtiene el token de acceso de Auth0
                const response = await fetch(
                    `http://localhost:3000/api/reservations/${reservationId}`, // Endpoint para verificar el estado de la reserva
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`, // Incluye el token en los headers
                        },
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Error al verificar el estado del pago");
                }

                const data = await response.json();

                // Verifica el estado de la reserva
                if (data.status === "confirmed") {
                    setPaymentConfirmed(true);
                } else if (data.status === "rejected" || data.status === "cancelled") {
                    setErrorMessage("El pago ha sido rechazado o cancelado.");
                } else {
                    setErrorMessage("El pago está pendiente de confirmación.");
                }
            } catch (error) {
                console.error("Error verificando el estado del pago:", error);
                setErrorMessage("Error al verificar el estado del pago. Por favor, inténtalo de nuevo más tarde.");
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        };

        checkPaymentStatus();
    }, [reservationId, getAccessTokenSilently]);

    // Renderiza el estado de carga
    if (loading) {
        return <p>Verificando el estado del pago...</p>;
    }

    // Renderiza el mensaje de error si existe
    if (errorMessage) {
        return <p style={{ color: "red" }}>{errorMessage}</p>;
    }

    // Renderiza el mensaje de confirmación si el pago fue aprobado
    if (paymentConfirmed) {
        return <p>¡Tu pago se ha confirmado! Gracias por tu reserva.</p>;
    }

    // Renderiza el mensaje de estado pendiente
    return <p>El pago está pendiente de confirmación. Por favor, espera o verifica el estado de tu pago en MercadoPago.</p>;
};

export default ConfirmedPay;