import React from 'react';

const RoomResultCard = ({ room, onReserve }) => {
  if (!room) return null;

  return (
    <div className="mt-6 flex flex-col items-center gap-4 border rounded-xl shadow-md p-4 bg-white">
      {room.photoRoom && (
        <img
          src={room.photoRoom}
          alt={`Foto de ${room.roomType?.name || 'habitación'}`}
          className="rounded-xl shadow-lg max-w-xs w-full h-auto"
        />
      )}
      <div  className="text-center">
        <h3 className="font-semibold text-lg">{room.roomType?.name}</h3>
        <p className="text-gray-600">Capacidad: {room.capacity} huéspedes</p>
        <p className="text-gray-600">Precio: ${room.price}/noche</p>
      </div>
      <button
        onClick={onReserve}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
      >
        Reservar ahora
      </button>
    </div>
  );
};

export default RoomResultCard;
