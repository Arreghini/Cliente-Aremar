import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import reservationService from '../../services/ReservationService';
import roomService from '../../services/RoomService';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import EditReservationModal from '../molecules/EditReservationModal';
import PayButton from './PayButton';
import { initMercadoPago } from '@mercadopago/sdk-react';

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
    <div className="container mx-auto px-4 max-w-6xl h-screen overflow-y-auto">
      <button
        onClick={() => setIsVisible(!isVisible)} 
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
      >
        {isVisible ? 'Ocultar Mis Reservas' : 'Mostrar Mis Reservas'}
      </button>

      {isVisible && (
        <ul className="mt-4 w-full space-y-4 pb-20">
          {reservations.length === 0 ? (
            <p className="text-gray-500">No tienes reservas en este momento.</p>
          ) : (
            reservations.map((reservation) => {
              const remainingAmount = reservation.totalPrice - (reservation.amountPaid || 0);

              return (
                <li key={reservation.id} className="flex flex-col gap-4 border-b py-4 w-full">
                  <div className="flex justify-between items-start w-full">
                    <div className="flex flex-col flex-grow">
                      <span className="font-bold">Habitación: {reservation.roomId}</span>
                      <span>Check-in: {new Date(reservation.checkIn).toLocaleDateString()}</span>
                      <span>Check-out: {new Date(reservation.checkOut).toLocaleDateString()}</span>
                      <span>Huéspedes: {reservation.numberOfGuests}</span>
                      <span>Estado: {reservation.status}</span>
                      <span className="font-bold">Precio total: ${reservation.totalPrice}</span>
                      <span className="font-bold">Monto pagado: ${reservation.amountPaid || 0}</span>
                      {remainingAmount > 0 && (
                        <span className="font-bold text-red-500">Saldo restante: ${remainingAmount}</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {reservation.status === 'pending' && (
                        <>
                        <div className =  "flex flex-col gap-2 mb-2">
                          <span className="text-blue-900 font-bold">Señá tu reserva</span>
                          <PayButton
                            reservationId={reservation.id}
                            price={reservation.totalPrice * 0.5}
                            containerId={`deposit-pay-${reservation.id}`}
                            paymentType="deposit"
                          />
                        </div>
                        <div className =  "flex flex-col gap-2 mb-2">
                          <span className="text-blue-900 font-bold">Pagá el total de tu reserva:</span>
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
                        <div className =  "flex flex-col gap-2 mb-2">
                          <span className="text-blue-900 font-bold">Pagá el saldo restante:</span>
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