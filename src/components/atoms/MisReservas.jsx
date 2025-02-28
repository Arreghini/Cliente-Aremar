import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import reservationService from '../../services/ReservationService';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import EditReservationModal from '../molecules/EditReservationModal';

const MisReservas = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReservations, setShowReservations] = useState(false);
  const [editingReservation, setEditingReservation] = useState({
    id: '',
    roomId: '',
    type: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    totalPrice: 0,
    status: 'pending'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUserReservations = async () => {
    if (!user?.sub) return;
    try {
      const token = await getAccessTokenSilently();
      const response = await reservationService.getUserReservations(token, user.sub);
      setReservations(response.data || []);
    } catch (error) {
      console.error('Error en fetchUserReservations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (reservation) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    const editData = {
      id: reservation.id,
      roomId: reservation.Room?.id || '',
      type: reservation.Room?.RoomType?.name || '',
      checkInDate: formatDate(reservation.checkIn),
      checkOutDate: formatDate(reservation.checkOut),
      numberOfGuests: reservation.numberOfGuests,
      totalPrice: reservation.totalPrice,
      status: reservation.status
    };
    
    console.log('Datos formateados para editar:', editData);
    setEditingReservation(editData);
    setIsModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditingReservation({
      ...editingReservation,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    console.log('Estado actual antes de enviar:', editingReservation.status);
    
    const updateData = {
      roomId: editingReservation.roomId,
      checkIn: editingReservation.checkInDate,
      checkOut: editingReservation.checkOutDate,
      numberOfGuests: parseInt(editingReservation.numberOfGuests),
      status: editingReservation.status 
    };
  
    try {
      const token = await getAccessTokenSilently();
      console.log('Datos a enviar:', updateData);
      const response = await reservationService.updateReservation(token, editingReservation.id, updateData);
      console.log('Respuesta del servidor:', response);
      
      // Actualización inmediata del estado local
      setReservations(prevReservations => 
        prevReservations.map(res => 
          res.id === editingReservation.id 
            ? {...res, status: editingReservation.status}
            : res
        )
      );
      
      await fetchUserReservations();
      setIsModalOpen(false);
      setEditingReservation(null);
    } catch (error) {
      console.error('Error al actualizar la reserva:', error);
    }
  };
  
  useEffect(() => {
    fetchUserReservations();
  }, [user]);

  if (isLoading) return <p className="text-gray-500">Cargando reservas...</p>;
  if (!isLoading && reservations.length === 0) return <p className="text-gray-500">No tienes reservas en este momento.</p>;

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
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <label className="font-semibold">Estado:</label>
                      <select
                        value={editingReservation.status}
                        onChange={(e) =>
                          setEditingReservation({ ...editingReservation, status: e.target.value })
                        }
                        className="border p-1"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                    {/* Rest of your form fields */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingReservation(null)}
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <span className="font-bold">{reservation.Room?.id}</span> -{' '}
                    <span className="font-bold">{reservation.Room?.RoomType?.name}</span> -{' '}
                    <span>Check-in: {new Date(reservation.checkIn).toLocaleDateString()}</span> -{' '}
                    <span>Check-out: {new Date(reservation.checkOut).toLocaleDateString()}</span> -{' '}
                    <span>Huéspedes: {reservation.numberOfGuests}</span> -{' '}
                    <span>Estado: {reservation.status}</span> -{' '}
                    <span>Precio: ${reservation.totalPrice}</span>
                  </div>
                  <div className="flex gap-2">
                    <DeleteButton
                      reservationId={reservation.id}
                      onDelete={(id) =>
                        setReservations((prev) => prev.filter((res) => res.id !== id))
                      }
                    />
                    <EditButton
                      reservationId={reservation.id}
                      onEdit={() => handleEdit(reservation)}
                    />
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <EditReservationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingReservation(null);
        }}
        reservation={editingReservation}
        onSave={handleSaveEdit}
        onChange={handleEditChange}
      />
    </div>
  );
};

export default MisReservas;
