import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import reservationService from '../../services/ReservationService';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import EditReservationModal from '../molecules/EditReservationModal';
import PayButton from './PayButton';
import { initMercadoPago } from '@mercadopago/sdk-react';

const PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
initMercadoPago(PUBLIC_KEY);

const MisReservas = () => {
  const namespace = 'https://aremar.com/';
  const { getAccessTokenSilently, user } = useAuth0();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReservations, setShowReservations] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
      setShowReservations(false);
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
      numberOfGuests: parseInt(editingReservation.numberOfGuests),
      status: editingReservation.status
    };

    try {
      const token = await getAccessTokenSilently();
      await reservationService.updateReservation(token, editingReservation.id, updateData);
      
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

  const handlePay = async (reservationId) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.post(
        `http://localhost:3000/api/payments/create-payment`,
        { reservationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.href = response.data.init_point;
    } catch (error) {
      console.error('Error al iniciar el pago:', error);
    }
  };

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user?.sub) {
        try {
          const token = await getAccessTokenSilently();
          const response = await axios.post(
            'http://localhost:3000/api/users/sync',
            user,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIsAdmin(response.data.data.isAdmin);
        } catch (error) {
          console.log('Error al verificar rol:', error);
        }
      }
    };
    checkAdminRole();
    fetchUserReservations();
  }, [user]);

  if (isLoading) return <p className="text-gray-500">Cargando reservas...</p>;
  if (!isLoading && reservations.length === 0) return <p className="text-gray-500">No tienes reservas en este momento.</p>;

  return (
    <div className="container mx-auto px-4 max-w-6xl h-screen overflow-y-auto">
      <div className="sticky top-0 bg-white py-4 z-10">
        <button
          onClick={() => setShowReservations(!showReservations)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showReservations ? 'Ocultar reservas' : 'Mostrar reservas'}
        </button>
      </div>
      {showReservations && (
      <ul className="mt-4 w-full space-y-4 pb-20">
          {reservations.map((reservation) => (
            <li key={reservation.id} className="flex flex-col gap-4 border-b py-4 w-full">
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col flex-grow">
                  <span className="font-bold">Habitación: {reservation.Room?.id}</span>
                  <span>Tipo: {reservation.Room?.RoomType?.name}</span>
                  <span>Check-in: {new Date(reservation.checkIn).toLocaleDateString()}</span>
                  <span>Check-out: {new Date(reservation.checkOut).toLocaleDateString()}</span>
                  <span>Huéspedes: {reservation.numberOfGuests}</span>
                  <span>Estado: {reservation.status}</span>
                  <span className="font-bold">Precio: ${reservation.totalPrice}</span>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  {(isAdmin || (!isAdmin && reservation.status === 'pending')) && (
                    <>
                      <DeleteButton
                        reservationId={reservation.id}
                        onDelete={(id) => setReservations((prev) => prev.filter((res) => res.id !== id))}
                      />
                      <EditButton
                        reservationId={reservation.id}
                        onEdit={() => handleEdit(reservation)}
                      />
                    </>
                  )}
                  {reservation.status === 'pending' && (
  <div className="w-full mt-2">
    <PayButton
      reservationId={reservation.id}
      amount={reservation.totalPrice}
      currency="ARS"
      containerId={`wallet_container_${reservation.id}`}
      isTestMode={true}
    />
  </div>
)}



                </div>
              </div>
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
