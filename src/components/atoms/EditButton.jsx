// src/components/atoms/EditButton.jsx
import React from 'react';
import { Pencil } from 'lucide-react';

const EditButton = ({ onEdit, reservationId }) => {
  return (
    <button
      onClick={() => onEdit(reservationId)}
      className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
      title="Editar reserva"
    >
      <Pencil className="w-5 h-5" />
    </button>
  );
};

export default EditButton;
