import React, { useState, useEffect } from 'react';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { useAuth0 } from '@auth0/auth0-react';

const PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY; 
initMercadoPago(PUBLIC_KEY);

const PayButton = ({ reservationId, price, containerId }) => {
    const [preferenceId, setPreferenceId] = useState(null);
    const { getAccessTokenSilently } = useAuth0();

    console.log("Renderizando PayButton:", { reservationId, price, containerId });

    useEffect(() => {
        const createPreference = async () => {
            try {
                console.log("Creando preferencia de pago...");
                console.log("Datos enviados al backend:", {
                    reservationId,
                    price,
                });

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
                console.log("Respuesta del backend al crear preferencia:", data);

                if (data.preferenceId) {
                    setPreferenceId(data.preferenceId); // Guarda el preferenceId para usarlo en el botón
                    console.log("Preference ID creado:", data.preferenceId);
                } else {
                    console.error("No se recibió un preferenceId en la respuesta del backend.");
                }
            } catch (error) {
                console.error('Error al crear la preferencia de pago:', error);
            }
        };

        createPreference();
    }, [reservationId, price, getAccessTokenSilently]);

    useEffect(() => {
        if (preferenceId) {
            console.log("Inicializando botón de MercadoPago con preferenceId:", preferenceId);
            const container = document.querySelector(`#${containerId}`);
            
            if (!container) {
                console.error(`El contenedor con ID ${containerId} no existe en el DOM.`);
                return;
            }

            const mp = new window.MercadoPago(PUBLIC_KEY);
            mp.bricks().create('wallet', containerId, {
                initialization: {
                    preferenceId: preferenceId,
                },
                settings: {
                    cardNumber: {
                        length: 16, // Longitud esperada del número de tarjeta
                    },
                    expirationDate: {
                        format: 'MM/YY', // Formato de la fecha de expiración
                    },
                    securityCode: {
                        length: 3, // Longitud del código de seguridad
                    },
                },
            }).catch((error) => {
                console.error("Error al inicializar el botón de MercadoPago:", error);
            });
        }
    }, [preferenceId, containerId]);

    return (
        <div>
            <div id={containerId}></div> {/* Contenedor único para el botón de MercadoPago */}
        </div>
    );
};

export default PayButton;