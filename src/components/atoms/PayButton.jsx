import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const PUBLIC_KEY = 'APP_USR-7d9d2ca4-125c-4d35-b754-c2eff0718113';

const PayButton = ({ reservationId, amount, currency, containerId = "wallet_container" }) => {
  const [containerReady, setContainerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const createPaymentPreference = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `http://localhost:3000/api/reservations/${reservationId}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error creando preferencia:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!window.MercadoPago) {
      const script = document.createElement("script");
      script.src = "https://sdk.mercadopago.com/js/v2";
      script.crossOrigin = "anonymous";
      script.onload = () => setContainerReady(true);
      document.body.appendChild(script);
    } else {
      setContainerReady(true);
    }
}, []);

  useEffect(() => {
    if (!containerReady) return;

    const loadMercadoPago = async () => {
      setIsLoading(true);
      try {
        const { preferenceId } = await createPaymentPreference();
        const mp = new window.MercadoPago(PUBLIC_KEY);
        
        // Esperamos a que el DOM esté listo
        setTimeout(() => {
          const container = document.getElementById(containerId);
          if (container) {
            mp.bricks().create("wallet", containerId, {
              initialization: {
                preferenceId: preferenceId
              }
            });
          }
        }, 100);

      } catch (error) {
        console.error("Error al cargar MercadoPago:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMercadoPago();
}, [containerReady, reservationId, containerId]);

  return (
    <div className="payment-container">
      {isLoading ? (
        <div className="text-center">
          <span className="loading-spinner">Preparando pago...</span>
        </div>
      ) : (
        <div
  id={containerId}
  className="w-full flex justify-center"
  style={{ 
    minHeight: "150px", 
    border: "1px solid #eee",
    margin: "10px 0"
  }}
/>

      )}
    </div>
  );
};

export default PayButton;
