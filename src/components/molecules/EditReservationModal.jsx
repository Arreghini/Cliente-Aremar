import React, { useEffect } from 'react';

const EditReservationModal = ({ isOpen, onClose, reservation, onSave, onChange }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !reservation) return null;

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Editar Reserva #{reservation.id}</h2>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Habitación</label>
            <input
              type="text"
              value={reservation.roomId}
              readOnly
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Check-in</label>
            <input
              type="date"
              name="checkInDate"
              value={formatDate(reservation.checkInDate)}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Check-out</label>
            <input
              type="date"
              name="checkOutDate"
              value={formatDate(reservation.checkOutDate)}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Estado</label>
            <select
              name="status"
              value={reservation.status}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Cantidad de huéspedes</label>
            <input
              type="number"
              name="numberOfGuests"
              value={reservation.numberOfGuests}
              onChange={handleChange}
              className="w-full border rounded p-2"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Precio total</label>
            <input
              type="text"
              name="totalPrice"
              value={reservation.totalPrice}
              readOnly
              className="w-full border rounded p-2 bg-gray-100"
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
