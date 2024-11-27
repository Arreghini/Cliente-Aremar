import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import reservationService from '../../services/ReservationService';
import DeleteButton from './DeleteButton'; 
import EditButton from './EditButton'; 

const MisReservas = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReservations, setShowReservations] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);

  const fetchUserReservations = async () => {
    if (!user?.sub) return;
    try {
      const token = await getAccessTokenSilently();
      const data = await reservationService.getUserReservations(token, user.sub);
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al obtener las reservas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (reservationData) => {
    console.log("Editando reserva:", reservationData);
    setEditingReservation(reservationData);
  };
  

  const handleSaveEdit = async (updatedData) => {
    try {
      const token = await getAccessTokenSilently();
      await reservationService.updateReservation(token, editingReservation.id, updatedData);
      setEditingReservation(null);
      fetchUserReservations(); // Recargar las reservas
    } catch (error) {
      console.error('Error al actualizar la reserva:', error);
    }
  };

  useEffect(() => {
    fetchUserReservations();
  }, [user]);

  if (isLoading) return <p className="text-gray-500">Cargando reservas...</p>;
  if (reservations.length === 0) return <p className="text-gray-500">No tienes reservas en este momento.</p>;

  return (
    <div className="p-4">
      <button 
        onClick={() => setShowReservations(!showReservations)} 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {showReservations ? 'Ocultar reservas' : 'Mostrar reservas'}
      </button>

      {showReservations && (
        <ul className="mt-4">
          {reservations.map((reservation) => (
            <li key={reservation.id} className="flex items-center justify-between border-b py-2">
              {editingReservation?.id === reservation.id ? (
                <div className="w-full">
                  <input 
                    type="date" 
                    defaultValue={editingReservation.checkInDate}
                    className="border p-1 mr-2"
                  />
                  <input 
                    type="date" 
                    defaultValue={editingReservation.checkOutDate}
                    className="border p-1 mr-2"
                  />
                  <button 
                    onClick={() => handleSaveEdit(editingReservation)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Guardar
                  </button>
                  <button 
                    onClick={() => setEditingReservation(null)}
                    className="bg-gray-500 text-white px-2 py-1 rounded ml-2"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <span className="font-bold">{reservation.roomType}</span> -{' '}
                    {reservation.checkInDate} - {reservation.checkOutDate}
                  </div>
                  <div className="flex gap-2">
                    <DeleteButton
                      reservationId={reservation.id}
                      onDelete={(id) => setReservations(prev => prev.filter(res => res.id !== id))}
                    />
                    <EditButton 
                      reservationId={reservation.id} 
                      onEdit={handleEdit}
                    />
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MisReservas;
