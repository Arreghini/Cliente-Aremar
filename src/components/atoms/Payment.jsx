import React, { useState } from 'react';
import reservationService from '../../services/ReservationService';
import { useAuth0 } from "@auth0/auth0-react";
import { LuCircleDollarSign } from "react-icons/lu";

const Payment = ({ reservationId, onPaymentSuccess, onPaymentError }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const handlePayment = async () => {
    setIsLoading(true); // Iniciar el estado de carga antes de realizar la operación.
    try {
      const token = await getAccessTokenSilently();
      await reservationService.confirmPayment(token, reservationId);
      setIsLoading(false); // Finalizar la carga después del éxito.
      onPaymentSuccess(); // Llamar al callback en caso de éxito.
    } catch (error) {
      setIsLoading(false); // Finalizar la carga en caso de error.
      onPaymentError(error); // Llamar al callback con el error.
    }
  };

  return (
    <div className="payment-container">
      <button
        onClick={handlePayment}
        className="payment-button flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        disabled={isLoading} // Deshabilitar el botón mientras se está procesando.
      >
        {isLoading ? (
          <span className="loading-spinner">Cargando...</span> // Agregar indicador de carga visual.
        ) : (
          <>
            <LuCircleDollarSign className="mr-2" /> Pagar
          </>
        )}
      </button>
    </div>
  );
};

export default Payment;
