import React from 'react';

const EditReservationModal = ({ isOpen, onClose, reservation, onSave, onChange }) => {
  if (!isOpen || !reservation) return null;

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Editar Reserva #{reservation.id}</h2>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">ID Habitación</label>
            <input
              type="text"
              name="roomId"
              value={reservation.roomId}
              onChange={onChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Check-in</label>
            <input
              type="date"
              name="checkInDate"
              value={formatDate(reservation.checkInDate)}
              onChange={onChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Check-out</label>
            <input
              type="date"
              name="checkOutDate"
              value={formatDate(reservation.checkOutDate)}
              onChange={onChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">status</label>
            <input
            type="text"
              name="status"
              value={reservation.status}
              onChange={onChange}
              className="w-full border rounded p-2"
              />
              </div>
              <div>
                <label className="block text-sm font-medium">Cantidad de huéspedes</label>
                <input
                type="text"
                name="numberOfGuests"
                value={reservation.numberOfGuests}
                onChange={onChange}
                className="w-full border rounded p-2"
                />
                </div>
              <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReservationModal;
