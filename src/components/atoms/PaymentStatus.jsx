import React  from 'react';
import { useLocation } from 'react-router-dom';

const PaymentStatus = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const status = queryParams.get('status');
    const reservationId = queryParams.get('reservationId');

    console.log("Parámetros recibidos en el frontend:", { status, reservationId });

    if (!status || !reservationId) {
        return <p>Parámetros inválidos</p>;
    }

    return (
        <div>
            <h1>Estado del Pago</h1>
            <p>Status: {status}</p>
            <p>Reservation ID: {reservationId}</p>
        </div>
    );
};

export default PaymentStatus;