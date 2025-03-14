import axios from 'axios';
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const ConfirmedPay = ({reservationId}) => {
    const { getAccessTokenSilently } = useAuth0();
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('');

    const handlePayment = async () => {
        try {
            setLoading(true);
            const token = await getAccessTokenSilently();
            const response = await axios.post(
                `http://localhost:3000/api/reservations/${reservationId}/payment`,
                {
                    payer: {
                        email: "test_user_1295939460@testuser.com",
                        identification: {
                            type: "DNI",
                            number: "12345678"
                        }
                    },
                    test: true
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Verificar el estado del pago
            if(response.data.status === 'approved') {
                setPaymentStatus('confirmed');
            }
            
            window.location.href = response.data.init_point;
        } catch (error) {
            console.error("Error iniciando pago:", error);
            setPaymentStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {paymentStatus === 'confirmed' && (
                <div className="confirmation-message">
                    <h2>¡Reserva Confirmada!</h2>
                    <p>Su pago ha sido procesado exitosamente.</p>
                </div>
            )}
            
            <button 
                onClick={handlePayment}
                disabled={loading || paymentStatus === 'confirmed'}
            >
                {loading ? 'Procesando...' : 'Confirmar Pago'}
            </button>
        </div>
    );
};

export default ConfirmedPay;
