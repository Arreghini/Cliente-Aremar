import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import reservationService from '../../services/ReservationService';

const PUBLIC_KEY = "TEST-0e701379-c683-429c-8069-2cbe9db84e01"

const PayButton = ({ reservationId, amount }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const loadMercadoPagoScript = () => {
    return new Promise((resolve) => {
      if (window.MercadoPago) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.type = 'text/javascript';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const loadMercadoPago = async () => {
      if (!reservationId || !amount) return;
      
      setIsLoading(true);
      try {
        await loadMercadoPagoScript();
        const token = await getAccessTokenSilently();
        const prefId = await reservationService.createPaymentPreference(token, reservationId, amount);
        
        const mp = new window.MercadoPago(PUBLIC_KEY, {
          locale: 'es-AR',
          advancedFraudPrevention: true,
          trackingDisabled: false,
          siteId: 'MLA'
        });

        await mp.bricks().create("wallet", "wallet_container", {
          initialization: {
            preferenceId: prefId
          },
          callbacks: {
            onReady: () => {
              console.log('Brick listo');
              setIsLoading(false);
            },
            onError: (error) => {
              console.error('Error en Brick:', error);
              setIsLoading(false);
            }
          }
        });
      } catch (error) {
        console.error("Error al inicializar pago:", error);
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
