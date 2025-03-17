import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const PayButton = ({ reservationId, amount, currency }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessTokenSilently, user } = useAuth0();

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessTokenSilently();
      
      console.log("Iniciando solicitud de pago para reserva:", reservationId);
      
      // Usar una cuenta de prueba diferente que no requiera verificación
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
              email: "test_user_123456789@testuser.com", // Usar el email del usuario autenticado o una cuenta de prueba alternativa
              identification: {
                type: "DNI",
                number: "12345678"
              }
            },
            test: true
          })
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la respuesta (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      
      if (data.init_point) {
        console.log("Redirigiendo a:", data.init_point);
        window.location.href = data.init_point;
      } else {
        throw new Error("No se recibió una URL de pago válida");
      }
    } catch (error) {
      console.error("Error iniciando pago:", error);
      alert(`Error al iniciar el pago: ${error.message}`);
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
