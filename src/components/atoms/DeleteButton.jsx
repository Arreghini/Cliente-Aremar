// src/components/atoms/DeleteButton.jsx
import React from 'react';
import { Trash2 } from 'lucide-react';

const DeleteButton = ({ onDelete, reservationId }) => {
  return (
    <button
      onClick={() => onDelete(reservationId)}
      className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"
      title="Eliminar reserva"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
};

export default DeleteButton;
