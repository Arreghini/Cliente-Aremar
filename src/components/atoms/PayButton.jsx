import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import reservationService from '../../services/ReservationService';

const PUBLIC_KEY = "TEST-0e701379-c683-429c-8069-2cbe9db84e01"

const PayButton = ({ reservationId, amount }) => {
  const [containerReady, setContainerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const createPaymentPreference = async (paymentData) => {
    try {
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('Error al crear preferencia de pago');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creando preferencia:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadMercadoPago = async () => {
      if (!reservationId || !amount || !containerReady) return;
      
      setIsLoading(true);
      try {
        const mp = new MercadoPago(PUBLIC_KEY);
        const preference = await createPaymentPreference({
          reservationId,
          amount
        });

        mp.bricks().create("wallet", "wallet_container", {
          initialization: {
            preferenceId: preference.id
          }
        });
      } catch (error) {
        console.error('Error al cargar MercadoPago:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const script = document.createElement('script');
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.onload = () => {
      setContainerReady(true);
    };
    document.body.appendChild(script);

    loadMercadoPago();
  }, [reservationId, amount, containerReady, getAccessTokenSilently]);

  return (
    <div className="payment-container">
      {isLoading ? (
        <div className="text-center">
          <span className="loading-spinner">Preparando pago...</span>
        </div>
      ) : (
        <div 
          id="wallet_container" 
          className="w-full flex justify-center" 
          style={{ minHeight: '200px', width: '100%' }}
        ></div>
      )}
    </div>
  );
};

export default PayButton;
