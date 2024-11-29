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
  const [editingReservation, setEditingReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const handleEdit = (reservation) => {
  const editData = {
    id: reservation.id,
    roomId: reservation.Room?.id || reservation.roomId || reservation.roomID,
    checkInDate: new Date(reservation.checkIn).toISOString().split('T')[0],
    checkOutDate: new Date(reservation.checkOut).toISOString().split('T')[0],
    numberOfGuests: reservation.numberOfGuests || 1,
    status: reservation.status
  };
  
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
    
    const updateData = {
      roomId: editingReservation.roomId,
      checkIn: editingReservation.checkInDate,
      checkOut: editingReservation.checkOutDate,
      numberOfGuests: parseInt(editingReservation.numberOfGuests)
    };
  
    try {
      const token = await getAccessTokenSilently();
      await reservationService.updateReservation(token, editingReservation.id, updateData);
      await fetchUserReservations();
      setIsModalOpen(false);
      setEditingReservation(null);
    } catch (error) {
      console.error('Error detallado:', error);
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
                      <label className="font-semibold">Número de huéspedes:</label>
                      <input
                        type="number"
                        value={editingReservation.numberOfGuests}
                        onChange={(e) =>
                          setEditingReservation({
                            ...editingReservation,
                            numberOfGuests: parseInt(e.target.value, 10),
                          })
                        }
                        className="border p-1"
                        min="1"
                        max="10"
                      />
                    </div>
                    <div className="flex flex-col">
                    <div>
                    <label className="block text-sm font-medium">Habitación</label>
                    <input
                      type="text"
                      name="roomType"
                      value={reservation.roomId}
                      className="w-full border rounded p-2 bg-gray-100"
                      disabled
                    />
                  </div>
                      <label className="font-semibold">Habitación:</label>
                      <input
                        type="text"
                        value={editingReservation.roomId}
                        onChange={(e) =>
                          setEditingReservation({ ...editingReservation, roomId: e.target.value })
                        }
                        className="border p-1"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-semibold">Check-in:</label>
                      <input
                        type="date"
                        value={editingReservation.checkInDate}
                        onChange={(e) =>
                          setEditingReservation({ ...editingReservation, checkInDate: e.target.value })
                        }
                        className="border p-1"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-semibold">Check-out:</label>
                      <input
                        type="date"
                        value={editingReservation.checkOutDate}
                        onChange={(e) =>
                          setEditingReservation({ ...editingReservation, checkOutDate: e.target.value })
                        }
                        className="border p-1"
                      />
                    </div>
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
                    <span className="font-bold">Habitación: {reservation.roomType}</span> -{' '}
                    <span>Check-in: {new Date(reservation.checkIn).toLocaleDateString()}</span> -{' '}
                    <span>Check-out: {new Date(reservation.checkOut).toLocaleDateString()}</span> -{' '}
                    <span>Número de huéspedes: {reservation.numberOfGuests}</span>
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
