import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import reservationService from '../../services/ReservationService';
import roomService from '../../services/RoomService';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import EditReservationModal from '../molecules/EditReservationModal';
import PayButton from './PayButton';
import { initMercadoPago } from '@mercadopago/sdk-react';
import ActionButton from '../atoms/ActionButton';
import StatusTag from './StatusTag';

const PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
initMercadoPago(PUBLIC_KEY);

const MisReservas = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [isVisible, setIsVisible] = useState(false); 

  const fetchUserReservations = async () => {
    if (!user?.sub) {
      console.error("No se encontró el ID del usuario.");
      return;
    }
    try {
      const token = await getAccessTokenSilently();
      const response = await reservationService.getUserReservations(token, user.sub);
      console.log("Reservas obtenidas (con roomId):", response);

      if (Array.isArray(response)) {
        setReservations(response);
      } else if (response.data && Array.isArray(response.data)) {
        setReservations(response.data);
      } else {
        console.error("La respuesta del backend no contiene un array de reservas.");
        setReservations([]);
      }
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (updatedFields) => {
    setEditingReservation((prevReservation) => ({
      ...prevReservation,
      ...updatedFields,
    }));
  };

  const handleEdit = (reservation) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };
    console.log("Reserva al editar:", reservation);

    setEditingReservation({
      id: reservation.id,
      roomId: reservation.room?.id || reservation.roomId,
      checkInDate: formatDate(reservation.checkIn),
      checkOutDate: formatDate(reservation.checkOut),
      numberOfGuests: reservation.numberOfGuests,
      totalPrice: reservation.totalPrice,
      status: reservation.status,
    });
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    try {
      const token = await getAccessTokenSilently();
      if (!editingReservation) {
        console.error('No hay reserva para editar.');
        return;
      }

      const reservationData = {
        id: editingReservation.id,
        checkIn: editingReservation.checkInDate,
        checkOut: editingReservation.checkOutDate,
        numberOfGuests: editingReservation.numberOfGuests,
        roomId: editingReservation.roomId,
        status: editingReservation.status,
      };

      console.log('Datos enviados al servicio:', reservationData);

      // Obtener el tipo de habitación basado en el roomId
      const actualRoomType = await roomService.getRoomTypeById(
        token,
        editingReservation.roomId
      );

      console.log('Tipo de habitación actual:', actualRoomType);

      // Verificar disponibilidad de habitaciones del mismo tipo
      const availability = await roomService.checkAvailability(
        token,
        reservationData.id,
        actualRoomType.id,
        reservationData.checkIn,
        reservationData.checkOut,
        reservationData.numberOfGuests
      );

      console.log('Disponibilidad obtenida:', availability);

      if (!availability.isAvailable || availability.availableRooms.length === 0) {
        throw new Error('No hay habitaciones disponibles para el tipo seleccionado.');
      }

      // Seleccionar la primera habitación disponible
      const selectedRoom = availability.availableRooms[0];
      console.log('Habitación seleccionada:', selectedRoom);

      // Actualizar el roomId con la nueva habitación seleccionada
      reservationData.roomId = selectedRoom.id;

      // Llama al servicio para actualizar la reserva
      const updatedReservation = await reservationService.updateReservation(
        token,
        editingReservation.id,
        reservationData
      );

      console.log('Reserva actualizada desde el backend:', updatedReservation);

      // Recargar las reservas desde el backend
      await fetchUserReservations();

      setIsModalOpen(false);
      setEditingReservation(null);
    } catch (error) {
      console.error('Error al guardar los cambios de la reserva:', error.message);
      alert(error.message || 'Ocurrió un error al guardar los cambios.');
    }
  };

  useEffect(() => {
    fetchUserReservations();
  }, [user, getAccessTokenSilently]);

  if (isLoading) return <p className="text-gray-500">Cargando reservas...</p>;

  return (
    <div className="container mx-auto px-4 max-w-6xl py-6">
  <ActionButton onClick={() => setIsVisible(!isVisible)} className="mb-6">
  {isVisible ? 'Ocultar Mis Reservas' : 'Mostrar Mis Reservas'}
</ActionButton>
  {isVisible && (
    <ul className="space-y-6">
      {reservations.length === 0 ? (
        <p className="text-neutral-oscuro font-body text-center">No tienes reservas en este momento.</p>
      ) : (
        reservations.map((reservation) => {
          const remainingAmount = reservation.totalPrice - (reservation.amountPaid || 0);
          return (
            <li
              key={reservation.id}
              className="bg-neutral-claro shadow-md rounded-xl p-6 font-body text-neutral-oscuro"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div>
                  <p className="font-heading text-mar-profundo text-xl mb-2">Habitación: {reservation.roomId}</p>
                  <p>Check-in: {new Date(reservation.checkIn).toLocaleDateString()}</p>
                  <p>Check-out: {new Date(reservation.checkOut).toLocaleDateString()}</p>
                  <p>Huéspedes: {reservation.numberOfGuests}</p>
                  <div className="mt-2">
                    <StatusTag status={reservation.status} />
                  </div>
                  <p className="mt-2 font-bold">Precio total: ${reservation.totalPrice}</p>
                  <p className="font-bold">Monto pagado: ${reservation.amountPaid || 0}</p>
                  {remainingAmount > 0 && (
                    <p className="font-bold text-red-600">Saldo restante: ${remainingAmount}</p>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  {reservation.status === 'pending' && (
                    <>
                      <div>
                        <p className="font-heading text-mar-profundo">Señá tu reserva</p>
                        <PayButton
                          reservationId={reservation.id}
                          price={reservation.totalPrice * 0.5}
                          containerId={`deposit-pay-${reservation.id}`}
                          paymentType="deposit"
                        />
                      </div>
                      <div>
                        <p className="font-heading text-mar-profundo">Pagá el total</p>
                        <PayButton
                          reservationId={reservation.id}
                          price={reservation.totalPrice}
                          containerId={`total-pay-${reservation.id}`}
                          paymentType="total"
                        />
                      </div>
                    </>
                  )}

                  {reservation.status === 'confirmed' && remainingAmount > 0 && (
                    <div>
                      <p className="font-heading text-mar-profundo">Pagá el saldo restante</p>
                      <PayButton
                        reservationId={reservation.id}
                        price={remainingAmount}
                        containerId={`remaining-pay-${reservation.id}`}
                        paymentType="remaining"
                      />
                    </div>
                  )}

                  {reservation.status === 'pending' && (
                    <>
                      <EditButton
                        reservationId={reservation.id}
                        onEdit={() => handleEdit(reservation)}
                      />
                      <DeleteButton
                        reservationId={reservation.id}
                        onDelete={(id) =>
                          setReservations((prev) => prev.filter((res) => res.id !== id))
                        }
                      />
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })
      )}
    </ul>
  )}

  {isModalOpen && (
    <EditReservationModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      reservation={editingReservation}
      onSave={handleSaveEdit}
      onChange={handleChange}
    />
  )}
</div>
  );
};

export default MisReservas;