import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

const PayButton = ({ reservationId, amount, currency }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `http://localhost:3000/api/reservations/${reservationId}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            payer: {
              email: "test_user_1295939460@testuser.com", // Usuario de prueba oficial
              identification: {
                type: "DNI",
                number: "12345678"
              }
            },
            test: true
          })
        }
      );
      const data = await response.json();
      window.location.href = data.init_point;
    } catch (error) {
      console.error("Error iniciando pago:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
    >
      {isLoading ? "Procesando..." : "Pagar Reserva"}
    </button>
  );
};

export default PayButton;
