import React, { useState, useEffect } from 'react';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { useAuth0 } from '@auth0/auth0-react';
import PropTypes from 'prop-types';

const PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
initMercadoPago(PUBLIC_KEY);

const PayButton = ({ reservationId, price, containerId, paymentType }) => { // <-- agregamos paymentType
    const [preferenceId, setPreferenceId] = useState(null);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const createPreference = async () => {
            try {
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
                            reservationId,
                            paymentType, 
                        }),
                    }
                );

                const data = await response.json();
                if (data.preferenceId) {
                    setPreferenceId(data.preferenceId);
                } else {
                    console.error("No se recibió un preferenceId en la respuesta del backend.");
                }
            } catch (error) {
                console.error('Error al crear la preferencia de pago:', error);
            }
        };

        createPreference();
    }, [reservationId, price, paymentType, getAccessTokenSilently]); 

    useEffect(() => {
        if (preferenceId) {
            const container = document.querySelector(`#${containerId}`);
            if (!container) {
                console.error(`El contenedor con ID ${containerId} no existe en el DOM.`);
                return;
            }
            //Limpio el contenedor antes de inicializar el botón
            container.innerHTML = ''; // Limpio el contenedor antes de inicializar el botón

            const mp = new window.MercadoPago(PUBLIC_KEY);
            mp.bricks().create('wallet', containerId, {
                initialization: { preferenceId },
                settings: {
                    cardNumber: { length: 16 },
                    expirationDate: { format: 'MM/YY' },
                    securityCode: { length: 3 },
                },
            }).catch((error) => {
                console.error("Error al inicializar el botón de MercadoPago:", error);
            });
        }
    }, [preferenceId, containerId]);

    return (
        <div>
            <div id={containerId}></div>
        </div>
    );
};
PayButton.propTypes = {
    reservationId: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    containerId: PropTypes.string.isRequired,
    paymentType: PropTypes.string.isRequired, 
};

export default PayButton;
