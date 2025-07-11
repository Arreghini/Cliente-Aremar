import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import PropTypes from "prop-types";

const ConfirmedPay = ({ reservationId }) => {
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        if (!reservationId) {
            setErrorMessage("No se proporcionó un ID de reserva válido.");
            setLoading(false);
            return;
        }

        const checkPaymentStatus = async () => {
            try {
                setLoading(true);
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
                console.log("Estado de la reserva recibido:", data.status);

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
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <p style={{ color: "green", fontSize: "20px" }}>
                    ¡Reserva confirmada! Haz clic en el botón para volver al inicio.
                </p>
                <button
                    onClick={() => navigate("/home")}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "green",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Volver al inicio
                </button>
            </div>
        );
    }

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <p style={{ color: "orange", fontSize: "20px" }}>
                El pago está pendiente de confirmación. Por favor, espera.
            </p>
        </div>
    );
};

ConfirmedPay.propTypes = {
  reservationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ConfirmedPay;