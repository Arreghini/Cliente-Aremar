import React, { useState } from 'react';
import reservationService from '../services/reservationService';

const ReservationForm = ({ roomId, onReserve }) => {
  const [formData, setFormData] = useState({
    userId: '',
    roomId: roomId,
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    totalPrice: 0,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reservationService.createReservation(formData);
      onReserve();
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="userId"
        value={formData.userId}
        onChange={handleChange}
        placeholder="User ID"
        required
      />
      <input
        type="date"
        name="checkInDate"
        value={formData.checkInDate}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="checkOutDate"
        value={formData.checkOutDate}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="guests"
        value={formData.guests}
        onChange={handleChange}
        min="1"
        required
      />
      <input
        type="number"
        name="totalPrice"
        value={formData.totalPrice}
        onChange={handleChange}
        required
      />
      <button type="submit">Reserve</button>
    </form>
  );
};

export default ReservationForm;
