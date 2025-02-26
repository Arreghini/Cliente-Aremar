import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

//const PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
const PUBLIC_KEY = 'APP_USR-7d9d2ca4-125c-4d35-b754-c2eff0718113';

const PayButton = ({ reservationId, amount, currency }) => {
  const [containerReady, setContainerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const createPaymentPreference = async () => {
    try {
        const token = await getAccessTokenSilently();
        console.log('Iniciando pago para reserva:', reservationId);
        
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

        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        return data;
    } catch (error) {
        console.error("Error creando preferencia:", error);
        throw error;
    }
};

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.onload = () => setContainerReady(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Elimina el script al desmontar el componente
    };
  }, []);

  useEffect(() => {
    if (!containerReady || !reservationId || !amount || !currency) return;

    const loadMercadoPago = async () => {
      setIsLoading(true);
      try {
        const { preferenceId } = await createPaymentPreference();

        const mp = new window.MercadoPago('APP_USR-7d9d2ca4-125c-4d35-b754-c2eff0718113', {
          locale: 'es-AR'
      });
      
      mp.bricks().create("wallet", "wallet_container", {
          initialization: {
              preferenceId
          },
          customization: {
              visual: {
                  style: {
                      theme: 'default'
                  }
              }
          }
      });
      
      } catch (error) {
        console.error("Error al cargar MercadoPago:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMercadoPago();
  }, [containerReady, reservationId, amount, currency]);

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
          style={{ minHeight: "200px", width: "100%" }}
        ></div>
      )}
    </div>
  );
};

export default PayButton;
