import React, { useState } from 'react';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { useAuth0 } from '@auth0/auth0-react';

const PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY; 
initMercadoPago(PUBLIC_KEY);

const PayButton = ({ reservationId, price, containerId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      if (!containerId) {
        console.error('containerId no está definido en PayButton');
        return;
      }

      const token = await getAccessTokenSilently();
      const response = await fetch(
        `http://localhost:3000/api/reservations/${reservationId}/payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: [
              {
                id: String(reservationId),
                title: `Reserva #${reservationId}`,
                unit_price: Number(price),
                quantity: 1,
                currency_id: 'ARS',
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (data.preferenceId) {
        const mp = new window.MercadoPago(PUBLIC_KEY); // Inicializar MercadoPago

    

        const container = document.querySelector(`#${containerId.replace(/^#/, '')}`);
        if (!container) {
          console.error(`El contenedor con id #${containerId} no existe en el DOM.`);
          return;
        }

        mp.bricks().create("wallet", `${containerId.replace(/^#/, '')}`, {
          initialization: {
            preferenceId: data.preferenceId, // ID de la preferencia generada en tu backend
          },
          customization: {
            texts: {
              valueProp: 'Paga de forma segura con MercadoPago', // Texto personalizado
            },
          },
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isLoading ? 'Procesando...' : 'Pagar con MercadoPago'}
      </button>
      <div id={containerId}></div> {/* Contenedor para el botón de pago */}
    </div>
  );
};

export default PayButton;