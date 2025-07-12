import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const EditReservationModal = ({
  isOpen,
  onClose,
  reservation,
  onSave,
  onChange,
}) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center min-h-screen"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-xl shadow-2xl flex flex-col"
        style={{
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">
          Editar Reserva #{reservation.id}
        </h2>
        <form onSubmit={onSave} className="space-y-4 flex flex-col">
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
              value={reservation.checkInDate}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Check-out</label>
            <input
              type="date"
              name="checkOutDate"
              value={reservation.checkOutDate}
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
            <label className="block text-sm font-medium">
              Cantidad de huéspedes
            </label>
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
              className="w-32 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-32 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
EditReservationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default EditReservationModal;
