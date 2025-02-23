import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

const PayButton = ({ reservationId, amount }) => {
  const [containerReady, setContainerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const createPaymentPreference = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `http://localhost:3000/api/reservations/${reservationId}/create-preference`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reservationId, amount }),
        }
      );

      if (!response.ok) throw new Error("Error al crear preferencia de pago");

      const data = await response.json();
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
    if (!containerReady || !reservationId || !amount) return;

    const loadMercadoPago = async () => {
      setIsLoading(true);
      try {
        const { preferenceId } = await createPaymentPreference();

        const mp = new window.MercadoPago(PUBLIC_KEY);
       
        mp.bricks().create("wallet", "wallet_container", {
          initialization: {
              preferenceId, // ✅ Usa la variable con el ID real de la preferencia
          },
          customization: {
            texts: {
              valueProp: 'smart_option',
            },
          },
        });        

      } catch (error) {
        console.error("Error al cargar MercadoPago:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMercadoPago();
  }, [containerReady, reservationId, amount]);

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
