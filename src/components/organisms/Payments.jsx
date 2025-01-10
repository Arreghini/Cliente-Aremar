import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import paymentImage from "../../assets/logos/payment.png"; 
import reservationService from "../../services/ReservationService";

  const createPaymentPreference = async (paymentData) => {
    try {
      console.log('Enviando datos de pago:', paymentData);
      
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });
  
      if (!response.ok) {
        throw new Error('Error al crear preferencia de pago');
      }
  
      const data = await response.json();
      
      if (!data.preferenceId) {
        throw new Error('No se recibió ID de preferencia');
      }
  
      return data.preferenceId;
    } catch (error) {
      console.error('Error creando preferencia:', error);
      throw error;
    }
  };
  
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
