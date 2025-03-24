import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';

const PayButton = ({ reservationId, price }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessTokenSilently();
      
      const preferenceData = {
        items: [{
          id: String(reservationId),
          title: `Reserva #${reservationId}`,
          unit_price: Number(price),
          quantity: 1,
          currency_id: 'ARS'
        }]
      };

      const response = await fetch(
        `http://localhost:3000/api/reservations/${reservationId}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(preferenceData)
        }
      );

      const data = await response.json();
      
      if (data.preferenceId) {
        // Redirección al sandbox de MercadoPago (para pruebas)
        window.location.href = `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=${data.preferenceId}`;
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button 
      onClick={handlePayment}
      disabled={isLoading}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {isLoading ? "Procesando..." : "Pagar con MercadoPago"}
    </button>
  );
};

export default PayButton;