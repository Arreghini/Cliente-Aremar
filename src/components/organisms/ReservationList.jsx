import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import reservationService from '../../services/ReservationService';
import EditButton from '../atoms/EditButton';
import DeleteButton from '../atoms/DeleteButton';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const { getAccessTokenSilently, user } = useAuth0();

  const fetchUserReservations = async () => {
    if (!user?.sub) return;
    
    try {
      const token = await getAccessTokenSilently();
      const data = await reservationService.getUserReservations(token, user.sub);
      console.log('Datos recibidos:', data);
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log('Error fetching reservations:', error);
      setReservations([]);
    }
  };
  
  useEffect(() => {
  const loadReservations = async () => {
    if (user) {
      try {
        const token = await getAccessTokenSilently();
        console.log('Iniciando fetch de reservas para usuario:', user.sub);
        const data = await reservationService.getUserReservations(token, user.sub);
        console.log('Reservas obtenidas:', data);
        setReservations(data);
      } catch (error) {
        console.log('Error completo:', error);
        setReservations([]);
      }
    }
  };

  loadReservations();
}, [user, getAccessTokenSilently]);

  const handleEdit = (reservationData) => {
    console.log('Editando reserva:', reservationData);
};

  const handleDelete = (deletedId) => {
    setReservations(reservations.filter(res => res.id !== deletedId));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Mis Reservas</h2>
      <div className="grid gap-4">
      {reservations.map((reservation) => (
      <div key={reservation.id} className="border p-4 rounded shadow">
             <div className="flex justify-between items-center">
              <div>
                <p>Número de huéspedes: {reservation?.guestsNumber || 'No especificado'}</p>
                <p>Habitación: {reservation.roomId}</p>
                <p>Check-in: {new Date(reservation.checkIn).toLocaleDateString()}</p>
                <p>Check-out: {new Date(reservation.checkOut).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <EditButton 
                reservationId={reservation.id} 
                onEdit={handleEdit}
                />
                <DeleteButton 
                  reservationId={reservation.id} 
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationList;
