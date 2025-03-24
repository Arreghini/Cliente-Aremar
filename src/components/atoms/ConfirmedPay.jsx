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
                const token = await getAccessTokenSilently();
                const response = await fetch(
                    `http://localhost:3000/api/reservations/${reservationId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Error al verificar el estado del pago");
                }

                const data = await response.json();

                if (data.status === "confirmed") {
                    setPaymentConfirmed(true);
                } else if (data.status === "rejected" || data.status === "cancelled") {
                    setErrorMessage("El pago ha sido rechazado o cancelado.");
                }
            } catch (error) {
                console.error("Error verificando el estado del pago:", error);
                setErrorMessage("Error al verificar el estado del pago. Por favor, inténtalo de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        checkPaymentStatus();
    }, [reservationId, getAccessTokenSilently]);

    if (loading) {
        return <p>Verificando el estado del pago...</p>;
    }

    if (errorMessage) {
        return <p style={{ color: "red" }}>{errorMessage}</p>;
    }

    if (paymentConfirmed) {
        return <p>¡Tu pago se ha confirmado! Gracias por tu reserva.</p>;
    }

    return <p>El pago está pendiente de confirmación. Por favor, espera o verifica el estado de tu pago en MercadoPago.</p>;
};

export default ConfirmedPay;