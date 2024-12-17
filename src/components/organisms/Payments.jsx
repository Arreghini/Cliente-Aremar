import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import paymentImage from "../../assets/logos/payment.png"; 
import reservationService from "../../services/ReservationService";

const MakePayment = ({ reservationId, amount, onPaymentSuccess, onPaymentError }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const initMercadoPago = async () => {
      if (!preferenceId) return;
      
      const mp = new MercadoPago('TU_PUBLIC_KEY', {
        locale: 'es-AR'
      });

      mp.checkout({
        preference: {
          id: preferenceId
        },
        render: {
          container: '.payment-button',
          label: 'Pagar'
        },
        autoOpen: true,
      });
    };

    if (preferenceId) {
      initMercadoPago();
    }
  }, [preferenceId]);

  useEffect(() => {
    const createPaymentPreference = async () => {
      if (!reservationId || !amount) {
        onPaymentError("Datos incompletos para el pago");
        return;
      }
    
      setIsLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const parsedAmount = parseFloat(amount);
    
        console.log('Iniciando pago con datos:', {
          reservationId,
          amount: parsedAmount
        });
    
        const response = await reservationService.confirmPayment(token, reservationId, {
          amount: parsedAmount
        });
    
        if (response?.preferenceId) {
          setPreferenceId(response.preferenceId);
          onPaymentSuccess();
        } else {
          throw new Error('No se recibió ID de preferencia');
        }
      } catch (error) {
        console.error('Error en pago:', error);
        onPaymentError(error.message);
      } finally {
        setIsLoading(false);
      }
    };    
    
    createPaymentPreference();
  }, [reservationId, amount, getAccessTokenSilently, onPaymentError]);

  return (
    <div>
      {isLoading ? (
        <p>Procesando pago...</p>
      ) : preferenceId ? (
        <div>
          <img
            src={paymentImage} // Usa la imagen correctamente
            alt="Botón de pago"
            className="w-32 h-32 cursor-pointer"
            onClick={() => onPaymentSuccess()} // Lógica para manejar clic en la imagen
          />
        </div>
      ) : (
        <p className="text-red-500">Error al cargar el pago</p>
      )}
    </div>
  );
};

export default MakePayment;
