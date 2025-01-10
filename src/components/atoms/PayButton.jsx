import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import reservationService from '../../services/ReservationService';

const PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
const PayButton = ({ reservationId, amount }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const loadMercadoPago = async () => {
      if (!reservationId || !amount) return;
  
      setIsLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const prefId = await reservationService.createPaymentPreference(token, reservationId, amount);
  
        const mp = new window.MercadoPago(PUBLIC_KEY, { locale: "es-AR" });
        mp.checkout({
          preference: { id: prefId },
          render: { container: ".payment-button", label: "Pagar con Mercado Pago" },
        });
      } catch (error) {
        console.error("Error al inicializar pago:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadMercadoPago();
  }, [reservationId, amount, getAccessTokenSilently]);  

  return (
    <div className="payment-container">
      {isLoading ? (
        <div className="text-center">
          <span className="loading-spinner">Preparando pago...</span>
        </div>
      ) : (
        <div className="payment-button w-full flex justify-center"></div>
      )}
    </div>
  );
};

export default PayButton;
